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
            font-size: 11px;
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
            background-clip: padding-box;
          }
          .table-cell {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            border: 1px solid black;
            border-collapse: collapse;
            font-weight: normal;
            font-family: 'Verdana';
            font-size: 11px;
            align-items: center;
            text-align: center;
            margin: auto;
            width: 90px;
          }
          .text-cell {
            mso-number-format: \@;
          }
        </style>
      `;
    // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = 'sandbox allow-downloads';
    document.head.appendChild(meta);
  },
  addDownloadButtonListener: function () {
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download as Excel';
    downloadButton.className = 'download-button';   
    this._container.prepend(downloadButton);
    downloadButton.addEventListener('click', (event) => {
       var uri = 'data:application/vnd.ms-excel;base64,'
       // , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
         , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        //, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
          , base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
          }
        //, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
          ,format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
              return c[p];
            })
          }
      var toExcel = document.querySelector('table').innerHTML;
      var ctx = {
        worksheet: name || '',
        table: toExcel
      };
      var link = document.createElement("a");
      link.download = "export.xlsx";
      link.href = uri + base64(format(template, ctx));
      window.open(link.href);
      //link.click();
      /*const scr_require = document.createElement('script');
      scr_require.src = 'https://requirejs.org/docs/release/2.3.5/minified/require.js';
      document.head.appendChild(scr_require);
      
     // const { Storage } = require('@google-cloud/storage');
     // const path = require('path');

      // Create a new instance of the storage client
      const storage = new Storage({
        projectId: 'acn-gcp-fsi',
        keyFilename: 'https://storage.cloud.google.com/acn-gcp-fsi/env/download.xls'
      });

      // Set the name of the bucket you want to upload to
      const bucketName = 'acn-gcp-fsi';

      // Set the path of the Excel file you want to upload
      const filePath =  link.href;

      // Upload the file to the specified bucket
      async function uploadFile() {
        const bucket = storage.bucket(bucketName);
        const fileName = path.basename(filePath);
        const file = bucket.file(fileName);

        await file.save(filePath);

        console.log(`File ${fileName} uploaded to ${bucketName}.`);
      }

      uploadFile();*/

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
      const scr = document.createElement('script');
      scr.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
      
      //scr.src = "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js";
      document.head.appendChild(scr);
      var ctx = { Worksheet: '26', table: table.innerHTML }
      var xl = format(template, ctx);
      const downloadUrl = uri + base64(xl);
      console.log(downloadUrl); // Prints the download URL to the console
      window.open(downloadUrl);
      //sleep(1000);
      //window.open(downloadUrl);
      //window.open(downloadUrl, "_blank");
       //var link = document.createElement("a");
       //link.download = 'sheet.xls';
       //link.href = downloadUrl;
       //document.body.appendChild(link);
       //link.click();
       //document.body.removeChild(link);
       //delete link;
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
          font-weight: normal;
          font-family: 'Verdana';
          font-size: 11px;
          align-items: center;
          text-align: center;
          margin: auto;
          width: 90px;
          background-clip: padding-box;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
          font-weight: normal;
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
        .text-cell {
            mso-number-format: \@;
          }
  </style>
  `;
    var k = 0;
    for (column_type of ["dimension_like", "measure_like", "table_calculations"]) {
      for (field of queryResponse.fields[column_type]) {
        for (row of data) {
          k++;
        }
        break
      }
    }
    generatedHTML += `<table class='table'>`;
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' rowspan='2' colspan='2' > </th>`;
    generatedHTML += `<th class='table-header' rowspan='1' colspan='${k}' style='height: 40px;'><b>Applicable<br>limit</br></b></th>`;
    generatedHTML += "</tr>";

    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header text-cell' colspan='${k}' style='font-size: 10px;'> 010 </th>`;
    generatedHTML += "</tr>";

    const header = ['Non institutions', 'Institutions', 'Institutions in %', 'Globally Systemic Important Institutions (G-SIIs)'];

    // Loop through the different types of column types looker exposes
    let i = 0;
    const header1 = ['010', '020', '030', '040'];
    for (column_type of ["dimension_like", "measure_like", "table_calculations"]) {

      // Look through each field (i.e. row of data)
      for (field of queryResponse.fields[column_type]) {
        // First column is the label
        generatedHTML += `<tr><th class='table-header'>${header1[i]}</th>`;
        generatedHTML += `<th class='table-header' style='text-align: left; padding: 5px;width:280px'>${header[i]}</th>`;
        // Next columns are the data
        for (row of data) {
          generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`
        }
        generatedHTML += '</tr>';
        i++;
      }
    }
    generatedHTML += "</table>";
    
    this._container.innerHTML = generatedHTML;
    this.addDownloadButtonListener();

    done();
  }

});
