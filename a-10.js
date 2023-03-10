import jsPDF from 'jspdf';

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
            margin: auto;
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
          th:before {
            content: '';
            top: 0;
            left: 0;
            border-top: 1px solid black;
            position: absolute;
            width: 100%;
        }
         th:after {
          content:''; 
          position:absolute; 
          left: 0; 
          bottom: 0; 
          width:100%; 
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }
        .div{
          overflow-y: auto;
          height: calc(100vh - 100px);
          margin-bottom: 100px;
        }
        </style>
      `;
  
      // Create a container element to let us center the text.
      //const div = document.createElement("div");
      //div.classList.add('div');
      //this._container = element.appendChild(div);
      this._container = element.appendChild(document.createElement("div"));
      //const div = document.createElement("div");
      const meta = document.createElement('meta');
      //div.classList.add('div');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = 'sandbox allow-downloads';
      //this._container = element.appendChild(div);
      document.head.appendChild(meta);
      
    },
  
    
     exportPDF: function (id) {
        const downloadButton = document.createElement('img');
        downloadButton.src = "https://cdn.jsdelivr.net/gh/Spoorti-Gandhad/AGBG-Assets@main/downloadAsExcel.jfif";
        downloadButton.setAttribute('height', '25px');
        downloadButton.setAttribute('width', '25px');
        downloadButton.setAttribute('title', 'Download As Pdf'); 
        downloadButton.style.marginLeft='90%';
        this._container.prepend(downloadButton);
        const cdn = document.createElement('script');
        cdn.src = "https://unpkg.com/jspdf";
        document.head.appendChild(cdn);
        const jsPdfAutoTable = document.createElement('script');
        jsPdfAutoTable.src = "https://unpkg.com/jspdf-autotable";
        document.head.appendChild(jsPdfAutoTable);
        downloadButton.addEventListener('click', (event) => {
         var doc = new jsPDF();
        //A4 - 595x842 pts
        //https://www.gnu.org/software/gv/manual/html_node/Paper-Keywords-and-paper-size-in-points.html
    
        var specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '.no-export': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true;
            }
        };
        

        //Html source 
        var source = document.getElementById(id);
    console.log(source);
        var margins = {
            top: 10,
            bottom: 10,
            left: 10,
            width: 595
        };
    
        doc.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left,
            margins.top, {
                'width': margins.width,
                'elementHandlers': specialElementHandlers
            },
    
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                doc.save('Test.pdf');
            }, margins);
            console.log(downloadUrl); // Prints the download URL to the console
            //sleep(1000);
            window.open(downloadUrl, "_blank");
            //const newTab=window.open(downloadUrl, "_blank");
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
            margin: auto;
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
          th:before {
            content: '';
            top: 0;
            left: 0;
            border-top: 1px solid black;
            position: absolute;
            width: 100%;
        }
          th:after {
          content:''; 
          position:absolute; 
          left: 0; 
          bottom: 0; 
          width:100%; 
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }
        .div{
          overflow-y: auto;
          height: calc(100vh - 100px);
          margin-bottom: 100px;
        }
        </style>
      `;
  
      generatedHTML += "<p style='font-family:Verdana;width:4100px;font-weight:bold;font-size:14px;align-items:center;text-align:left;border:1px solid black;padding: 5px;background-color: #eee;'>C 28.00 - Exposures in the non-trading and trading book (LE 2) </p>";
      generatedHTML += "<p style='font-family:Verdana;font-size:10px;align-items: center;text-align: right;padding: 5px;'>* All values reported are in millions </p>";
      generatedHTML += "<table class='table' id='table'>";
      generatedHTML += "<thead class='thead'>";
      generatedHTML += "<tr class='table-header' >";
      generatedHTML += `<th class='table-header' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>COUNTERPARTY</b><hr style="margin: 0;width: 48.78%;height: 0.6px;top: 27px;position: absolute;left: 0;background-color: black;"></th>`;
      generatedHTML += `<th class='table-header' colspan='15' style='height:25px;border: 1px solid black;background-color: #eee;font-family: Verdana;' ><b>ORIGINAL EXPOSURES</b></th>`;
      generatedHTML += `<th class='table-header' rowspan='5' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Value adjustments and provisions</th>`;
      generatedHTML += `<th class='table-header' rowspan='5' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Exposures deducted from CET 1 or Additional Tier 1 items</th>`;
      generatedHTML += `<th class='table-header' rowspan='3' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Exposure value before application of exemptions and CRM </b><hr style="margin: 0;position: absolute;width: 25.37%;top: 83px;left: 2260px;background-color: black;height: 0.6px;"></th>`;
      generatedHTML += `<th class='table-header' colspan='8' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>ELIGIBLE CREDIT RISK MITIGATION (CRM) TECHNIQUES</b><hr style="height: 0.6px;top: 27px;position: absolute;left: 2603px;width: 23.85%;margin: 0;background-color: black;"></th>`;
      generatedHTML += `<th class='table-header' rowspan='5' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Amounts exempted</th>`;
      generatedHTML += `<th class='table-header' rowspan='3' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Exposure value after application of exemptions and CRM</b><hr style="margin: 0;height: 0.6px;top: 83px;position: absolute;width: 8.4%;left: 3711.5px;background-color: black;"></th>`;
      generatedHTML += "</tr>";
      generatedHTML += "<tr class='table-header'>";
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Code<hr style="margin: 0;height: 0.6px;position: absolute;width: 100%;left: 0;top: 177px;background-color: black;"></th>`;
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Group or individual</th>`;
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Transactions where there is an exposure to underlying assets</th>`;
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Total original exposure</b></th>`;
      generatedHTML += `<th class='table-header' colspan='14' style='height:25px;background-color: #eee;color: #eee'>t<hr style="background-color: #eee;margin: 0;position: absolute;height: 0.6px;top: 55px;width:37.89%;background-color: #262d33;left: 442px;"></th>`;
      generatedHTML += `<th class='table-header' colspan='6' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Substitution effect of eligible credit risk mitigation techniques</th>`;
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Funded credit protection other than substitution effect</th>`;
      generatedHTML += `<th class='table-header' rowspan='4' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Real estate</th>`;
      generatedHTML += "</tr>";
      generatedHTML += "<tr>";
      generatedHTML += `<th class='table-header' colspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'></th>`;
      generatedHTML += `<th class='table-header' colspan='6' style='height:25px;border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Direct exposures<hr style="margin: 0;position: absolute;height: 0.6px;top: 82.5px;width: 36.16%;left: 442px;background-color: black;"></th>`;
      generatedHTML += `<th class='table-header' colspan='6' style='height:25px;border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Indirect exposures</th>`;
      generatedHTML += `<th class='table-header' rowspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Additional exposures arising from transactions where there is an exposure to underlying assets</th>`;
      generatedHTML += "</tr>";
      generatedHTML += "<tr>";
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'><i>Of which: defaulted</i></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Debt instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Equity instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Derivatives</th>`;
      generatedHTML += `<th class='table-header' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.52%;top: 133.5px;background-color: black;left: 956px;"></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Debt instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Equity instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Derivatives</th>`;
      generatedHTML += `<th class='table-header' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.49%;top: 133.5px;background-color: black;left: 1644.5px;"></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Total</b></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'><i>Of which: Non-trading book</i></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>% of Tier 1 capital </th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Debt instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Equity instruments</th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Derivatives</th>`;
      generatedHTML += `<th class='table-header' colspan='3' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.5%;top: 133.5px;background-color: black;left: 3024.7px;"></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Total</b></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'><i>Of which: Non-trading book</i></th>`;
      generatedHTML += `<th class='table-header' rowspan='2' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>% of Tier 1 capital</th>`;
      generatedHTML += "</tr>";
      generatedHTML += "<tr>";
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Loan commitments</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Financial guarantees</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Other commit-ments</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Loan commitments</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Financial guarantees</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>Other commit-ments</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Loan commitments</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Financial guarantees</th>`;
      generatedHTML += `<th class='table-header' rowspan='1' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>(-) Other commit-ments</th>`;
      generatedHTML += "</tr>";
  
  
  
      const header=['010','020','030','040','050','060','070','080','090','100','110','120','130','140','150','160','170','180','190','200','210','220','230','240','250','260','270','280','290','300','310','320','330','340','350'];
      // First row is the header
      generatedHTML += "<tr class='table-header'>";
      for (let i=0;i<header.length;i++) {
        generatedHTML += `<th class='table-header' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>${header[i]}<hr style="margin: 0;height: 0.6px;position: absolute;width: 100%;left: 0;top: 193px;background-color: black;"></th>`;
      }
      generatedHTML += "</tr>";
      generatedHTML += "</thead>";
  
      
      // Next rows are the data
      for (row of data) {
        generatedHTML += "<tr class='table-row'>";
        for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
          generatedHTML += `<td class='table-cell' style='border: 1px solid black;'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
        }
        generatedHTML += "</tr>";
      }
      generatedHTML += "</table>"; 
      this._container.innerHTML = generatedHTML; 
      this.exportPDF('table');
  
      done();
    }
  });
