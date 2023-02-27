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
            background-clip: padding-box;
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
        </style>
      `;
      // Create a container element to let us center the text.
      this._container = element.appendChild(document.createElement("div"));
      var XLSX = document.createElement("script");
      XLSX.type = "text/javascript";
      XLSX.src = "https://code.jquery.com/jquery-3.6.1.min.js";
      XLSX.integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=";
      XLSX.crossOrigin="anonymous";
  
      XLSX.onload = () => {
        this.addDownloadButtonListener();
      };
      document.head.appendChild(XLSX);
    },
  
    addDownloadButtonListener: function () {
      const downloadButton = this._container.appendChild(document.createElement('button'));
      downloadButton.innerHTML = 'Download as Excel';
      downloadButton.className = 'download-button';
      downloadButton.addEventListener('click', (event) => {
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{Worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) {
              const regex = /style="([^"]*)"/g;
              return s.replace(/{(\w+)}/g, function(m, p) {
                const cellHtml = c[p];
                const cellHtmlWithStyle = cellHtml.replace(regex, function(m, p1) {
                  return 'style="' + p1 + '"';
                });
                return cellHtmlWithStyle;
              });
            };
        var table = document.querySelector('table');
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
          var cells = rows[i].cells;
          for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            var backgroundColor = window.getComputedStyle(cell).backgroundColor;
            var border = window.getComputedStyle(cell).border;
            var fontWeight = window.getComputedStyle(cell).fontWeight;
            var fontFamily = window.getComputedStyle(cell).fontFamily;
            var fontSize = window.getComputedStyle(cell).fontSize;
            var style = 'background-color:' + backgroundColor + ';' +
                'border:' + border + ';' +
                'font-weight:' + fontWeight + ';' +
                'font-family:' + fontFamily + ';' +
                'font-size:' + fontSize + ';';

            cell.setAttribute('style', style);
          }
        }
        var ctx = {Worksheet: 'Worksheet', table: table.innerHTML}
        //window.location.href = uri + base64(format(template, ctx))
        const downloadUrl = uri + base64(format(template, ctx));
        console.log(downloadUrl); // Prints the download URL to the console

      });
    },
    
  
    // Utility function to convert string to ArrayBuffer
  
  
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
  </style>
  `;
      generatedHTML += `<table class='table' id='data_table' style="background-color: transparent; border:2px solid black; margin-top:15px;">`;
      generatedHTML += "<tr class='table-header'>";
      generatedHTML += `<th class='table-header' rowspan='2' colspan='2' > </th>`;
      generatedHTML += `<th class='table-header' rowspan='1' colspan='9' style='height: 40px;'><b>Applicable<br>limit</br></b></th>`;
      generatedHTML += "</tr>";
  
      generatedHTML += "<tr class='table-header'>";
      generatedHTML += `<th class='table-header' colspan='9' style='font-size: 10px;'> 010 </th>`;
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
  