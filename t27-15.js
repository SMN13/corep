looker.plugins.visualizations.add({
    // Id and Label are legacy properties that no longer have any function besides documenting
    // what the visualization used to have. The properties are now set via the manifest
    // form within the admin/visualizations page of Looker
    id: "looker_table",
    label: "Table",
    options: {
      font_size: {
        type: "number",
        label: "Font Size (px)",
        default: 11
      }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {
      console.log(config);
      // Insert a <style> tag with some styles we'll use later.
      element.innerHTML = `
        <style>
          .table {
            font-size: ${config.font_size}px;
            border: 1px solid black;
            border-collapse: collapse;
            margin:auto;
          }
          .table-header {
            background-color: #eee;
            border: 1px solid black;
            border-collapse: collapse;
            font-weight: normal;
            font-family: 'Verdana';
            font-size: 11px;
            align-items: center;
            text-align: center;
            margin: auto;
            width: 90px;
            postion: inherit;
          }
          .table-cell {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            border: 1px solid black;
            border-collapse: collapse;
            font-family: 'Verdana';
            font-size: 11px;
            align-items: center;
            text-align: center;
            margin: auto;
            width: 90px;
          }
          .thead{
            position: sticky;
            top: 0px; 
            z-index: 3;
          }
          th:after {
            content:''; 
            position:absolute; 
            left: 0; 
            bottom: 0; 
            width:100%; 
            border-bottom: 1px solid rgba(0,0,0,0.12);
          }
          th:before {
            left: 0;
            position: absolute;
            content: '';
            width: 100%;
            border-top: 1px solid #4c535b;
            top: 102px;
         }
         .div{
            overflow-y: auto;
            height: calc(100vh - 100px);
            margin-bottom: 100px;
            border-bottom: 0.5px solid black;
        }
        </style>
      `;
  
      // Create a container element to let us center the text.
      const div = document.createElement("div");
      div.classList.add('div');
      this._container = element.appendChild(div);
  
    },
  
    addDownloadButtonListener: function () {
        const downloadButton = this._container.appendChild(document.createElement('button'));
        downloadButton.innerHTML = 'Download as Excel';
        downloadButton.className = 'download-button';
        downloadButton.addEventListener('click', (event) => {
          var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{Worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) {
              const regex = /style="([^"]*)"/g;
              return s.replace(/{(\w+)}/g, function (m, p) {
                const cellHtml = c[p];
                const cellHtmlWithStyle = cellHtml.replace(regex, function (m, p1) {
                  return 'style="' + p1 + '"';
                });
                return cellHtmlWithStyle;
              });
            };
          var table = document.querySelector('table');
          table.style.border = '1px solid black';
          table.style.fontSize = '11px';
          var rows = table.rows;
          for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].cells;
            for (var j = 0; j < cells.length; j++) {
              var cell = cells[j];
              var backgroundColor = window.getComputedStyle(cell).backgroundColor;
              var fontWeight = window.getComputedStyle(cell).fontWeight;
              var fontFamily = window.getComputedStyle(cell).fontFamily;
              var fontSize = window.getComputedStyle(cell).fontSize;
              var style = 'background-color:' + backgroundColor + ';' +
                'border: 1px solid black;' +
                'font-weight:' + fontWeight + ';' +
                'font-size: 11pt;' +
                'font-family:' + fontFamily + ';' +
                'mso-number-format: "\ \@";' ;
              cell.setAttribute('style', style);
            }
          }
          
          const XLSX = document.createElement('script');
          XLSX.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
          document.head.appendChild(XLSX);
          var ctx = { Worksheet: '27', table: table.innerHTML }
          var xl = format(template, ctx);
          const downloadUrl = uri + base64(xl);
          console.log(downloadUrl); // Prints the download URL to the console
          //sleep(1000);
          //window.open(downloadUrl);
          //window.open(downloadUrl, "_blank");
          //for reloading
          //this opens a new tab while creating a variable name for that tab
          
          const newTab = window.open(downloadUrl);
          newTab.onload = function() {
          newTab.location.reload();
          }

          // var newTab = window.open(downloadUrl, "_blank");
          // newTab.alert("New Tab");
          // //this refreshes that new tab
          // newTab.location.reload();
    
          // function RefreshParent() {
          //   if (window.opener != null && !window.opener.closed) {
          //       window.opener.location.reload();
          //   }
          // }
          // window.onbeforeunload = RefreshParent;
        });
      },
    
    // Render in response to the data or settings changing
    updateAsync: function (data, element, config, queryResponse, details, done) {
      console.log(config);
      // Clear any errors from previous updates
      this.clearErrors();
  
      // Throw some errors and exit if the shape of the data isn't what this chart needs
      if (queryResponse.fields.dimensions.length == 0) {
        this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
        return;
      }
  
      /* Code to generate table
       * In keeping with the spirit of this little visualization plugin,
       * it's done in a quick and dirty way: piece together HTML strings.
       */
      var generatedHTML = `
        <style>
          .table {
            font-size: ${config.font_size}px;
            border: 1px solid black;
            border-collapse: collapse;
            margin:auto;
          }
          .table-header {
            background-color: #eee;
            border: 1px solid black;
            border-collapse: collapse;
            postion: inherit;
            font-weight: normal;
            font-family: 'Verdana';
            font-size: 11px;
            align-items: center;
            text-align: center;
            margin: auto;
            width: 90px;
          }
          .table-cell {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            border: 1px solid black;
            border-collapse: collapse;
            font-family: 'Verdana';
            font-size: 11px;
            align-items: center;
            text-align: center;
            margin: auto;
            width: 90px;
          }
           .table-row {
            border: 1px solid black;
            border-collapse: collapse;
          }
          .thead{
            position: sticky;
            top: 0px; 
            z-index: 3;
          }
          th:after {
            content:''; 
            position:absolute; 
            left: 0; 
            bottom: 0; 
            width:100%; 
            border-bottom: 1px solid rgba(0,0,0,0.12);
         }
        th:before {
            left: 0;
            position: absolute;
            content: '';
            width: 100%;
            border-top: 1px solid #4c535b;
            top: 102px;
        }
        .div{
            overflow-y: auto;
            height: calc(100vh - 100px);
            margin-bottom: 100px;
            border-bottom: 0.5px solid black;
        }
        </style>
      `;
  
      generatedHTML += "<table class='table'>";
      generatedHTML += "<thead class='thead'>";
      generatedHTML += "<tr class='table-header'>";
      generatedHTML += `<th class='table-header' colspan='8' style="font-weight: bold;height:19px;width: -webkit-fill-available; position: absolute">COUNTERPARTY IDENTIFICATION</th>`;
      generatedHTML += "</tr>";
      generatedHTML += "<tr class='table-header'>";
      generatedHTML += `<th class='table-header' style="height:100px;">Code</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">Type of Code</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">Name</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">National Code</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">Residence of the Counterparty</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">Sector of the Counterparty</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">NACE Code</th>`;
      generatedHTML += `<th class='table-header' style="height:100px;">Type of Counterparty</th>`;
      generatedHTML += "</tr>";
     
      const header=['011','015','021','035','040','050','060','070'];
      // First row is the header
      generatedHTML += "<tr class='table-header'>";
      for (let i=0;i<header.length;i++) {
        generatedHTML += `<th class='table-header'>${header[i]}</th>`;
      }
      generatedHTML += "</tr>";
      generatedHTML += "</thead>";

      // Next rows are the data
      for (row of data) {
        generatedHTML += "<tr class='table-row'>";
        for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
          generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
        }
        generatedHTML += "</tr>";
      }
      generatedHTML += "</table>";
  
      this._container.innerHTML = generatedHTML;
      this.addDownloadButtonListener();
      done();
    }
  });
