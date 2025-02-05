// Google Drive Index - 2025/02/05
// Fork of https://gitlab.com/GoogleDriveIndex/Google-Drive-Index/
// This was modified heavily with the help of DeepSeek R1, Claude, and other friends
// This is for the sole purpose of one-press downloading files
const serviceAccounts = [];
const randomserviceaccount = serviceAccounts[Math.floor(Math.random()*serviceAccounts.length)];
const config = {
  // Configuration section
  addParameters: "", //
  siteName: "Downloads",
  client_id: "", // Google Cloud Console client ID
  client_secret: "", // Google Cloud Console client secret
  refresh_token: "", // Auth token
  service_account: true, // If true, add the json to the const variable
  service_account_json: randomserviceaccount, // Load balances the service account api usage, hopefully
  root: "", // Root folder ID
  maximum_files_shown: 10
};


var gd;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) 
{
  const colo = request.cf.colo;
  const timestamp = Math.floor(Date.now() / 1000);
  if(typeof gd === 'undefined') {
    gd = new googleDrive(config);
  }

  if(request.method === 'POST') {
    return await apiRequest(request);
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Direct file download
  if(path.length > 1 && !path.endsWith('/')) {
    if(path.split('/').pop().toLowerCase() === '.password') {
      return new Response('', {status: 404});
    }
    const file = await gd.file(path);
    const range = request.headers.get('Range');
    return await gd.down(file.id, range);
  }

  // Render folder view
  return new Response(renderHTML(colo, timestamp, path), {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  });
}

function renderHTML(colo, timestamp, path) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex, noimageindex, nofollow, noarchive, nosnippet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗃️</text></svg>">
    <title>${config.siteName}</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
      :root {
        --text-color: #e0e2f4;
        --bg-color: #212121;
        --highlight-color: #aaa;
        --server-stats-color: #777;
        --body-font: normal 20px/1.25rem 'VT323', monospace;
        --h1-font: normal 2.75rem/1.05em 'VT323', monospace;
        --h2-font: normal 2rem/1.25em 'VT323', monospace;
        --common-font: normal 1.25rem 'VT323', monospace;
        text-align: center;
      }
  
      body {
        background: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-color);
        font: var(--body-font);
      }
  
      .container {
        width: 90%;
        margin: auto;
        max-width: 1000px;
        padding-top: 5%;
        padding-bottom: 5%;
      }
  
      h1 {
        font: var(--h1-font);
        margin: 20px 0;
      }
  
      h2 {
        font: var(--h2-font);
        margin: 0 0 5px 0;
      }
  
      p, a, button {
        font: var(--common-font);
        margin: 0;
      }
  
      .highlight-background {
        background: var(--highlight-color);
        color: var(--bg-color);
        padding: 0 15px 0 15px;
      }
  
      .highlight-background::selection {
        background-color: var(--bg-color);
        color: var(--highlight-color);
        padding: 1px 15px 1px 15px;
      }
  
      nav {
        margin: 20px 0;
      }
  
      a, button {
        text-decoration: none;
        color: var(--text-color);
        background: none;
        border: none;
        cursor: pointer;
        position: relative;
      }
  
      button {
        padding: 0 5px;
        margin: 0 5px;
      }
  
      .server-stats {
        font-size: 0.9rem;
        color: var(--server-stats-color);
      }
  
      button::before,
      button::after {
        content: '';
        position: absolute;
        top: 0;
        font-size: 1.25rem;
        transition: transform 0.2s ease;
      }
  
      button::before {
        content: '[';
        left: -3px;
        color: var(--text-color);
      }
  
      button::after {
        content: ']';
        right: -3px;
        color: var(--text-color);
      }
  
      a:hover,
      a:focus {
        color: var(--bg-color);
      }
  
      button:hover::before,
      button:focus::before {
        transform: translateX(-5px);
        color: var(--bg-color);
      }
  
      button:hover::after,
      button:focus::after {
        transform: translateX(5px);
        color: var(--bg-color);
      }
  
      button:hover,
      button:focus {
        background: var(--highlight-color);
        color: var(--bg-color);
      }
  
      button:hover span,
      button:focus span {
        color: var(--bg-color);
      }
  
      button:hover::before,
      button:focus::before,
      button:hover::after,
      button:focus::after {
        background: var(--highlight-color);
      }
  
      ::selection {
        background-color: var(--highlight-color);
        color: var(--bg-color);
        padding: 2px 15px 2px 15px;
      }
  
      br {
        display: block;
        content: "";
        margin-top: 0;
      }
  
      .input {
        border: 2px dashed var(--text-color);
        box-sizing: border-box;
        padding: .3rem;
        display: flex;
        align-items: center;
        background: none;
        color: var(--text-color);
        font: inherit;
        outline: none;
        width: 100%;
      }
  
      .input:not(:placeholder-shown) {
        border-style: solid;
      }
  
      spacer {
        display: block;
        content: "";
        margin-top: 1em;
      }
  
      .file-list {
        text-align: left;
        margin: 20px 0;
      }
  
      .file-details {
        flex: 1;
        text-align: right;
        font-size: 0.9em;
        color: var(--server-stats-color);
      }
  
      .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 0 10px 0 10px;
        text-decoration: none;
        color: var(--text-color); /* Ensure default color is set */
        background: transparent; /* Ensure default background is set */
      }
      
      .file-item:hover,
      .file-item:focus {
        background: var(--highlight-color);
        color: var(--bg-color); /* Change text color on hover/focus */
      }
      
      .file-name {
        flex: 1 1 auto;
        margin-right: 10px;
      }
      .file-item:hover .file-name,
      .file-item:focus .file-name,
      .file-item:hover .file-details,
      .file-item:focus .file-details {
        color: var(--bg-color); /* Ensure child elements also change color */
      }
      
      .file-item a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-decoration: none;
        color: inherit; /* Inherit color from parent */
      }
      
      .file-item a:hover,
      .file-item a:focus {
        color: var(--bg-color); /* Change text color on hover/focus */
      }
      
      /* Ensure default styles are reapplied after hover/focus ends */
      .file-item:not(:hover):not(:focus) {
        color: var(--text-color);
        background: transparent;
      }
      
      .file-item:not(:hover):not(:focus) .file-name,
      .file-item:not(:hover):not(:focus) {
        color: var(--text-color);
      }
  
      .loading {
        text-align: center;
        margin: 20px 0;
        font-size: 1.2em;
      }
  
      .folder::before {
        content: '📁';
        margin-right: 5px;
      }
  
      .file::before {
        content: '📄';
        margin-right: 5px;
      }

      .error {
        text-align: center;
        margin: 20px 0;
        font-size: 1.2em;
      }

      @media screen and (max-width: 600px) {
        body {
            font: var(--body-font);
        }

        .container {
            width: 90%;
            padding: 2%;
        }

        h1 {
            font-size: 2rem;
        }

        h2 {
            font-size: 1.5rem;
        }

        p, a {
            font-size: 1rem;
        }

        .file-list {
            font-size: 0.9rem;
        }

        .server-stats {
            font-size: 0.8rem;
        }
    }
    </style>
    <style>

  /* Add these styles */

  .pagination {

    margin: 20px 0;

    text-align: center;

  }

  

  .pagination button {

    margin: 0 10px;

  }

  

  .pagination button:disabled {

    opacity: 0.5;

    cursor: not-allowed;

  }

  

  #page-info {

    margin: 0 15px;

    color: var(--server-stats-color);

  }

  </style>
  </head>
  <body>
    <div class="container">
      <section>
        <h1>
          <span class="highlight-background">${config.siteName}</span>
        </h1>
        <div id="file-list" class="file-list">
        <p class="loading">- Requesting Data -</p>
        </div>
        <div id="file-list" class="file-list">

  </div>

  <div id="pagination" class="pagination" style="display: none;">

    <button id="prev-page" disabled>Previous</button>

    <span id="page-info"></span>

    <button id="next-page">Next</button>

  </div>
        <nav>
          <button onclick="window.history.back();">Go Back</button>
        </nav>
        <p class="server-stats">Served by Cloudflare ${colo}<br>${timestamp}</p>
      </section>
    </div>
    <script>
    function formatDate(dateString) {
      const date = new Date(dateString);
  
      // Month abbreviation
      const month = date.toLocaleString('en-US', { month: 'short' });
  
      // Day of the month, padded with zero
      const day = String(date.getDate()).padStart(2, '0');
  
      // Year
      const year = date.getFullYear();
  
      // Hours in 12-hour format, padded with zero
      let hours = date.getHours() % 12;
      hours = hours === 0 ? 12 : hours;
      hours = String(hours).padStart(2, '0');
  
      // Minutes, padded with zero
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      // Seconds, padded with zero
      const seconds = String(date.getSeconds()).padStart(2, '0');
  
      // AM or PM
      const ampm = date.getHours() >= 12 ? ' pm' : ' am';
  
      // Concatenate all parts to form the final date string
      const formattedDate = month + ' ' + day + ', ' + year + ' @ ' + hours + ':' + minutes + ':' + seconds + ampm;
  
      return formattedDate;
    }
  
    // Modified loadFiles function with page token caching
async function loadFiles(path) {
  const fileList = document.getElementById('file-list');
  const pagination = document.getElementById('pagination');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  
  fileList.innerHTML = '<p class="loading">- Retrieving Data -</p>';
  
  try {
    // Check if we have cached tokens for this path
    var cacheKey = 'pageTokens' + path;
    var tokens = JSON.parse(sessionStorage.getItem(cacheKey)) || [];
    var totalPages = tokens.length + 1;

    // Fetch all page tokens if not cached
    if (tokens.length === 0) {
      var currentToken = null;
      do {
        var response = await fetch(path, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            password: localStorage.getItem('password' + path) || '',
            pageToken: currentToken
          })
        });
        
        var data = await response.json();
        if (data.error) throw data.error;
        
        if (data.nextPageToken) {
          tokens.push(data.nextPageToken);
          currentToken = data.nextPageToken;
        } else {
          currentToken = null;
        }
      } while (currentToken);
      
      totalPages = tokens.length + 1;
      sessionStorage.setItem(cacheKey, JSON.stringify(tokens));
    }

    // Get current page from URL
    var urlParams = new URLSearchParams(window.location.search);
    var page = parseInt(urlParams.get('page')) || 1;
    page = Math.max(1, Math.min(page, totalPages));

    // Get appropriate page token
    var pageToken = page > 1 ? tokens[page - 2] : null;

    // Fetch current page data
    var response = await fetch(path, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        password: localStorage.getItem('password' + path) || '',
        pageToken: pageToken
      })
    });

    var data = await response.json();
    if (data.error) throw data.error;

    // Render files
    var html = '';
    for (var i = 0; i < data.files.length; i++) {
      var file = data.files[i];
      var isFolder = file.mimeType === 'application/vnd.google-apps.folder';
      var href = isFolder ? 
        path + file.name + '/' :
        path + file.name + '${config.addParameters}';
      
      var formattedDate = formatDate(file.modifiedTime);
      var formattedSize = formatFileSize(file.size);
      
      html += 
        '<a href="' + href + '" class="file-item">' +
          '<div class="' + (isFolder ? 'folder' : 'file') + ' file-name">' +
            file.name +
          '</div>' +
          '<div class="file-details">' +
            formattedDate + '<br>' +
            formattedSize +
          '</div>' +
        '</a>';
    }
    
    fileList.innerHTML = html;
    
    // Update pagination controls
    pagination.style.display = 'block';
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
    pageInfo.textContent = 'Page ' + page + ' of ' + totalPages;

    // Handle pagination clicks
    prevButton.onclick = function() {
      if (page > 1) {
        var url = new URL(window.location);
        url.searchParams.set('page', page - 1);
        window.history.pushState(null, '', url);
        loadFiles(path);
      }
    };

    nextButton.onclick = function() {
      if (page < totalPages) {
        var url = new URL(window.location);
        url.searchParams.set('page', page + 1);
        window.history.pushState(null, '', url);
        loadFiles(path);
      }
    };
    
  } catch (error) {
    fileList.innerHTML = '<p class="error" style="text">Something Went Wrong:<br />' + (error.message || 'Internal Server Error') + '</p>';
    console.error(error);
  }
}

// Update history management
document.addEventListener('click', function(e) {
  if (e.target.matches('a')) {
    e.preventDefault();
    var href = e.target.getAttribute('href');
    var url = new URL(href, window.location.origin);
    sessionStorage.removeItem('pageTokens' + url.pathname); // Clear cache for new path
    window.history.pushState(null, null, url.pathname + url.search);
    loadFiles(url.pathname);
  }
});

window.addEventListener('popstate', function() {
  var url = new URL(window.location);
  sessionStorage.removeItem('pageTokens' + url.pathname); // Clear cache when navigating back
  loadFiles(url.pathname);
});
  
      function formatFileSize(bytes) {
        if(bytes >= 1000000000) return (bytes/1000000000).toFixed(2)+' GB';
        if(bytes >= 1000000) return (bytes/1000000).toFixed(2)+' MB';
        if(bytes >= 1000) return (bytes/1000).toFixed(2)+' KB';
        if(bytes > 1) return bytes+' bytes';
        if(bytes === 1) return bytes+' byte';
        return '---';
      }
  
      loadFiles(window.location.pathname);
  
      document.addEventListener('click', (e) => {
        if(e.target.matches('a')) {
          e.preventDefault();
          const href = e.target.getAttribute('href');
          const normalizedHref = href.startsWith('/') ? href : '/' + href;
          history.pushState(null, null, normalizedHref);
          loadFiles(normalizedHref);
        }
      });
  
      window.addEventListener('popstate', () => {
        loadFiles(window.location.pathname);
      });

      window.addEventListener("beforeunload", function(e) {
        sessionStorage.removeItem("pageTokens");
        sessionStorage.removeItem("pageTokens/");
      }); 
      
    </script>
  </body>
  </html>`;
}

// Include the googleDrive class and JWT functionality from frontend.js
class googleDrive {
  constructor(authConfig) {
      this.authConfig = authConfig;
      this.paths = [];
      this.files = [];
      this.passwords = [];
      this.paths["/"] = authConfig.root;
      if(authConfig.root_pass != ""){
          this.passwords["/"] = authConfig.root_pass;
      }
      this.accessToken();
  }

  async down(id, range=''){
    let url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    let requestOption = await this.requestOption();
    requestOption.headers['Range'] = range;
    return await fetch(url, requestOption);
  }

  async file(path){
    if(typeof this.files[path] == 'undefined'){
      this.files[path]  = await this._file(path);
    }
    return this.files[path] ;
  }

  async _file(path){
    let arr = path.split('/');
    let name = arr.pop();
    name = decodeURIComponent(name).replace(/\'/g, "\\'");
    let dir = arr.join('/')+'/';
    ////console.log(name, dir);
    let parent = await this.findPathId(dir);
    ////console.log(parent);
    let url = 'https://www.googleapis.com/drive/v3/files';
    let params = {'includeItemsFromAllDrives':true,'supportsAllDrives':true};
    params.q = `'${parent}' in parents and name = '${name}' andtrashed = false`;
    params.fields = "files(id, name, mimeType, size ,createdTime, modifiedTime, iconLink, thumbnailLink)";
    url += '?'+this.enQuery(params);
    let requestOption = await this.requestOption();
    let response = await fetch(url, requestOption);
    let obj = await response.json();
    //console.log(obj);
    return obj.files[0];
  }

  // Request Cache
  async list(path){
    if (gd.cache == undefined) {
      gd.cache = {};
    }

    if (gd.cache[path]) {
      return gd.cache[path];
    }

    let id = await this.findPathId(path);
    var obj = await this._ls(id);
    if (obj.files && obj.files.length > 1000) {
          gd.cache[path] = obj;
    }

    return obj
  }

  async password(path){
    if(this.passwords[path] !== undefined){
      return this.passwords[path];
    }

    //console.log("load",path,".password",this.passwords[path]);

    let file = await gd.file(path+'.password');
    if(file == undefined){
      this.passwords[path] = null;
    }else{
      let url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      let requestOption = await this.requestOption();
      let response = await this.fetch200(url, requestOption);
      this.passwords[path] = await response.text();
    }

    return this.passwords[path];
  }

  async _ls(parent, pageToken = null){
    if(parent==undefined){
      return null;
    }
    const files = [];
    let obj;
    let params = {
      'includeItemsFromAllDrives': true,
      'supportsAllDrives': true,
      'pageSize': config.maximum_files_shown,
      'fields': "nextPageToken, files(id, name, mimeType, size, modifiedTime)",
      'q': `'${parent}' in parents and trashed = false AND name !='.password'`,
      'orderBy': 'folder,name,modifiedTime desc'
    };
  
    if (pageToken) {
      params.pageToken = pageToken;
    }
  
    let url = 'https://www.googleapis.com/drive/v3/files';
    url += '?' + this.enQuery(params);
    let requestOption = await this.requestOption();
    let response = await fetch(url, requestOption);
    obj = await response.json();
  
    return {
      files: obj.files,
      nextPageToken: obj.nextPageToken
    };
  }

  async findPathId(path){
    let c_path = '/';
    let c_id = this.paths[c_path];

    // Remove leading/trailing slashes and filter out empty segments
    let arr = path.split('/').filter(x => x.length > 0);
    
    for(let name of arr){
        c_path += name+'/';

        if(typeof this.paths[c_path] == 'undefined'){
            let id = await this._findDirId(c_id, name);
            this.paths[c_path] = id;
        }

        c_id = this.paths[c_path];
        if(c_id == undefined || c_id == null){
            break;
        }
    }
    return this.paths[path];
}

  async _findDirId(parent, name){
    name = decodeURIComponent(name).replace(/\'/g, "\\'");
    
    //console.log("_findDirId",parent,name);

    if(parent==undefined){
      return null;
    }

    let url = 'https://www.googleapis.com/drive/v3/files';
    let params = {'includeItemsFromAllDrives':true,'supportsAllDrives':true};
    params.q = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'  and trashed = false`;
    params.fields = "nextPageToken, files(id, name, mimeType)";
    url += '?'+this.enQuery(params);
    let requestOption = await this.requestOption();
    let response = await fetch(url, requestOption);
    let obj = await response.json();
    if(obj.files[0] == undefined){
      return null;
    }
    return obj.files[0].id;
  }

  async accessToken(){
    //console.log("accessToken");
    if(this.authConfig.expires == undefined  ||this.authConfig.expires< Date.now()){
      const obj = await this.fetchAccessToken();
      if(obj.access_token != undefined){
        this.authConfig.accessToken = obj.access_token;
        this.authConfig.expires = Date.now()+3500*1000;
      }
    }
    return this.authConfig.accessToken;
  }

  async fetchAccessToken() {
      //console.log("fetchAccessToken");
      const url = "https://www.googleapis.com/oauth2/v4/token";
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      var post_data;
      if (this.authConfig.service_account && typeof this.authConfig.service_account_json != "undefined") {
          const jwttoken = await JSONWebToken.generateGCPToken(this.authConfig.service_account_json);
          post_data = {
              grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              assertion: jwttoken,
          };
      } else {
          post_data = {
              client_id: this.authConfig.client_id,
              client_secret: this.authConfig.client_secret,
              refresh_token: this.authConfig.refresh_token,
              grant_type: "refresh_token",
          };
      }

      let requestOption = {
          'method': 'POST',
          'headers': headers,
          'body': this.enQuery(post_data)
      };

      const response = await fetch(url, requestOption);
      return await response.json();
  }

  async fetch200(url, requestOption) {
      let response;
      for (let i = 0; i < 3; i++) {
          response = await fetch(url, requestOption);
          //console.log(response.status);
          if (response.status != 403) {
              break;
          }
          await this.sleep(800 * (i + 1));
      }
      return response;
  }

  async requestOption(headers={},method='GET'){
    const accessToken = await this.accessToken();
    headers['authorization'] = 'Bearer '+ accessToken;
    return {'method': method, 'headers':headers};
  }

  enQuery(data) {
      const ret = [];
      for (let d in data) {
          ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }
      return ret.join('&');
  }

  sleep(ms) {
      return new Promise(function (resolve, reject) {
          let i = 0;
          setTimeout(function () {
              //console.log('sleep' + ms);
              i++;
              if (i >= 2) reject(new Error('i>=2'));
              else resolve(i);
          }, ms);
      })
  }
}

const JSONWebToken = {
  header: {
      alg: 'RS256',
      typ: 'JWT'
  },
  importKey: async function(pemKey) {
      var pemDER = this.textUtils.base64ToArrayBuffer(pemKey.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join(''));
      return crypto.subtle.importKey('pkcs8', pemDER, {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
      }, false, ['sign']);
  },
  createSignature: async function(text, key) {
      const textBuffer = this.textUtils.stringToArrayBuffer(text);
      return crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textBuffer)
  },
  generateGCPToken: async function(serviceAccount) {
      const iat = Math.floor(Date.now() / 1000);
      var payload = {
          "iss": serviceAccount.client_email,
          "scope": "https://www.googleapis.com/auth/drive",
          "aud": "https://oauth2.googleapis.com/token",
          "exp": iat + 3600,
          "iat": iat
      };
      const encPayload = btoa(JSON.stringify(payload));
      const encHeader = btoa(JSON.stringify(this.header));
      var key = await this.importKey(serviceAccount.private_key);
      var signed = await this.createSignature(encHeader + "." + encPayload, key);
      return encHeader + "." + encPayload + "." + this.textUtils.arrayBufferToBase64(signed).replace(/\//g, '_').replace(/\+/g, '-');
  },
  textUtils: {
      base64ToArrayBuffer: function(base64) {
          var binary_string = atob(base64);
          var len = binary_string.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
          }
          return bytes.buffer;
      },
      stringToArrayBuffer: function(str) {
          var len = str.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
              bytes[i] = str.charCodeAt(i);
          }
          return bytes.buffer;
      },
      arrayBufferToBase64: function(buffer) {
          let binary = '';
          let bytes = new Uint8Array(buffer);
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
      }
  }
};

// API request handler
async function apiRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  const option = {
    status: 200,
    headers: {'Access-Control-Allow-Origin': '*'}
  };

  if(path.endsWith('/')) {
    const password = await gd.password(path);
    if(password) {
      try {
        const obj = await request.json();
        if(password.replace("\n", "") !== obj.password) {
          return new Response(
            JSON.stringify({error: {code: 401, message: "password error"}}),
            option
          );
        }
      } catch(e) {
        return new Response(
          JSON.stringify({error: {code: 401, message: "password required"}}),
          option
        );
      }
    }
    
    const requestData = await request.json();
    const list = await gd._ls(await gd.findPathId(path), requestData.pageToken);
    return new Response(JSON.stringify(list), option);
  } else {
    const file = await gd.file(path);
    return new Response(JSON.stringify(file));
  }
}
