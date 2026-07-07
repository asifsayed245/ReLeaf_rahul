/**
 * Google Apps Script — Releaf CMS REST API
 *
 * DEPLOY: Extensions → Apps Script → Deploy → Manage deployments → edit → New version
 * - Execute as: Me
 * - Who has access: Anyone
 *
 * This script manages 3 sheets:
 * 1. "Contacts" — form submissions from the website
 * 2. "Blogs" — blog posts managed via CMS
 * 3. "SiteConfig" — key-value site configuration
 *
 * NOTE: The GCP project's OAuth consent screen must be "In production"
 * (not "Testing"), otherwise the stored authorization expires every 7 days
 * and the web app starts returning "Access denied".
 */

const SPREADSHEET_ID = '1iFN69Edt_Xq4V30n8sphIIR0GIQXfnFm3q1HnaYCdrA';

// Google Analytics 4 & Search Console configuration
const GA4_PROPERTY_ID = '542143620';
const GSC_SITE_URL = 'https://releaf.co.in/';

function getSheet(name) {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Blogs') {
      sheet.appendRow(['slug', 'title', 'excerpt', 'date', 'readTime', 'category', 'content', 'status']);
    } else if (name === 'SiteConfig') {
      sheet.appendRow(['key', 'value']);
      const defaults = [
        ['ownerName', 'Rahul Seth'],
        ['ownerTitle', 'Sobriety Coach & Certified Guidance Counsellor'],
        ['ownerPhoto', '/rahul-portrait.jpg'],
        ['ownerEmail', 'rahul@releaf.co.in'],
        ['ownerPhone', '+91 98202 81442'],
        ['whatsappNumber', '919820281442'],
        ['location', 'Mumbai, India · Online across India'],
        ['soberSince', '28 November 2016'],
        ['certifications', 'Certified Guidance Counsellor · CBT & REBT Therapist'],
        ['linkedIn', 'https://www.linkedin.com/in/rahulseth'],
        ['instagram', 'https://www.instagram.com/releaf.co.in'],
        ['adminPassword', 'releaf2024'],
      ];
      defaults.forEach(row => sheet.appendRow(row));
    } else if (name === 'Contacts') {
      sheet.appendRow(['Date', 'Name', 'Phone', 'Email', 'Message', 'Preferred Time', 'Status']);
    }
  }
  return sheet;
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function configToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const config = {};
  data.slice(1).forEach(row => { config[row[0]] = row[1]; });
  return config;
}

// ── GET handler ──
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || '';
  let result = {};

  try {
    switch (action) {
      case 'getBlogs': {
        result = { success: true, data: sheetToJson(getSheet('Blogs')) };
        break;
      }
      case 'getConfig': {
        result = { success: true, data: configToJson(getSheet('SiteConfig')) };
        break;
      }
      case 'getContacts': {
        result = { success: true, data: sheetToJson(getSheet('Contacts')) };
        break;
      }
      case 'checkPassword': {
        const password = e.parameter.password || '';
        const config = configToJson(getSheet('SiteConfig'));
        result = { success: true, valid: config.adminPassword === password };
        break;
      }
      case 'getAnalytics': {
        let traffic = [];
        let seo = [];

        // 1. Fetch Google Analytics 4 data
        if (GA4_PROPERTY_ID) {
          try {
            const metric = AnalyticsData.newMetric();
            metric.name = 'screenPageViews';

            const dimension = AnalyticsData.newDimension();
            dimension.name = 'date';

            const dateRange = AnalyticsData.newDateRange();
            dateRange.startDate = '365daysAgo';
            dateRange.endDate = 'today';

            const request = AnalyticsData.newRunReportRequest();
            request.dimensions = [dimension];
            request.metrics = [metric];
            request.dateRanges = [dateRange];

            const report = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
            if (report.rows) {
              traffic = report.rows.map(row => ({
                date: row.dimensionValues[0].value,
                views: parseInt(row.metricValues[0].value, 10)
              })).sort((a, b) => a.date.localeCompare(b.date));
            }
          } catch (e) {
            console.error('GA4 Error:', e);
          }
        }

        // 2. Fetch Search Console data (manual HTTP request)
        if (GSC_SITE_URL) {
          try {
            const today = new Date();
            const start = new Date();
            start.setDate(today.getDate() - 30);

            const payload = {
              startDate: Utilities.formatDate(start, 'UTC', 'yyyy-MM-dd'),
              endDate: Utilities.formatDate(today, 'UTC', 'yyyy-MM-dd'),
              dimensions: ['query'],
              rowLimit: 20
            };

            const response = UrlFetchApp.fetch(
              'https://searchconsole.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(GSC_SITE_URL) + '/searchAnalytics/query',
              {
                method: 'post',
                contentType: 'application/json',
                headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
                payload: JSON.stringify(payload),
                muteHttpExceptions: true
              }
            );

            const json = JSON.parse(response.getContentText());

            if (json.rows) {
              seo = json.rows.map(row => ({
                keyword: row.keys[0],
                clicks: row.clicks,
                impressions: row.impressions,
                ctr: row.ctr,
                position: row.position
              }));
            } else {
              console.error('GSC Error: No rows or error returned: ', response.getContentText());
            }
          } catch (e) {
            console.error('GSC Error:', e);
          }
        }

        result = { success: true, data: { traffic, seo } };
        break;
      }
      default:
        result = { success: false, error: 'Unknown action. Use: getBlogs, getConfig, getContacts, checkPassword, getAnalytics' };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST handler ──
function doPost(e) {
  const params = e.parameter || {};
  const action = params.action || '';

  // If no action param, it's the existing contact form submission
  if (!action) {
    return handleContactForm(e);
  }

  let result = {};

  try {
    switch (action) {
      case 'addBlog': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('Blogs');
        sheet.appendRow([
          body.slug, body.title, body.excerpt, body.date,
          body.readTime, body.category, body.content, body.status || 'published'
        ]);
        result = { success: true, message: 'Blog added' };
        break;
      }
      case 'updateBlog': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('Blogs');
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] === body.slug) {
            sheet.getRange(i + 1, 1, 1, 8).setValues([[
              body.slug, body.title, body.excerpt, body.date,
              body.readTime, body.category, body.content, body.status || 'published'
            ]]);
            result = { success: true, message: 'Blog updated' };
            break;
          }
        }
        if (!result.success) result = { success: false, error: 'Blog not found' };
        break;
      }
      case 'deleteBlog': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('Blogs');
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] === body.slug) {
            sheet.deleteRow(i + 1);
            result = { success: true, message: 'Blog deleted' };
            break;
          }
        }
        if (!result.success) result = { success: false, error: 'Blog not found' };
        break;
      }
      case 'updateConfig': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('SiteConfig');
        const data = sheet.getDataRange().getValues();
        let found = false;
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] === body.key) {
            sheet.getRange(i + 1, 2).setValue(body.value);
            found = true;
            break;
          }
        }
        if (!found) {
          sheet.appendRow([body.key, body.value]);
        }
        result = { success: true, message: 'Config updated' };
        break;
      }
      case 'bulkUpdateConfig': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('SiteConfig');
        const data = sheet.getDataRange().getValues();
        const entries = body.entries || {};
        Object.keys(entries).forEach(key => {
          let found = false;
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === key) {
              sheet.getRange(i + 1, 2).setValue(entries[key]);
              found = true;
              data[i][1] = entries[key];
              break;
            }
          }
          if (!found) {
            sheet.appendRow([key, entries[key]]);
          }
        });
        result = { success: true, message: 'Config bulk updated' };
        break;
      }
      case 'seedBlogs': {
        const body = JSON.parse(e.postData.contents);
        const sheet = getSheet('Blogs');
        const blogs = body.blogs || [];
        blogs.forEach(b => {
          sheet.appendRow([
            b.slug, b.title, b.excerpt, b.date,
            b.readTime, b.category, b.content, b.status || 'published'
          ]);
        });
        result = { success: true, message: blogs.length + ' blogs seeded' };
        break;
      }
      default:
        result = { success: false, error: 'Unknown action' };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Existing contact form handler (unchanged logic) ──
function handleContactForm(e) {
  try {
    const sheet = getSheet('Contacts');
    const params = e.parameter;
    sheet.appendRow([
      new Date(),
      params.name || '',
      params.phone || '',
      params.email || '',
      params.message || '',
      params.timeSlot || '',
      'New'
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Diagnostic: run this once after pasting to (re)grant authorization ──
function testGA4() {
  const metric = AnalyticsData.newMetric();
  metric.name = 'screenPageViews';
  const dimension = AnalyticsData.newDimension();
  dimension.name = 'date';
  const dateRange = AnalyticsData.newDateRange();
  dateRange.startDate = '30daysAgo';
  dateRange.endDate = 'today';
  const request = AnalyticsData.newRunReportRequest();
  request.dimensions = [dimension];
  request.metrics = [metric];
  request.dateRanges = [dateRange];
  const report = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
  Logger.log('ROWS RETURNED: ' + (report.rows ? report.rows.length : 'none'));
}
