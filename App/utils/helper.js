import {Platform} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PdfView from '../Components/PdfView';

export const htmlContent = async item => {
  let fromD = new Date(item.from_date).toDateString();
  let toD = new Date(item.to_date).toDateString();
  console.log('item', item);
  try {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report</title>
        <style>
            body {
              font-size: 16px;
              color: #000000;
            
            }

            h1 {
              text-align: center;
              color: #ffffff;
              
            }
            
            .imgContainer {
              display: flex;
              flex-direction: row;
              background-color: #525399;
              align-items: center;
            }
              
            #pdfMed {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#pdfMed td, #pdfMed th {
  border: 1px solid #ddd;
  padding: 8px;
}

#pdfMed tr:nth-child(even){background-color: #f2f2f2;}

#pdfMed tr:hover {background-color: #ddd;}

#pdfMed th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #525399;
  color: white;
}

        </style>
    </head>
    <body>
    <div class="imgContainer">

            <h1>Medicine Report</h1>
          </div>
        
        <div class="confirmationBox_content">

      <table id="pdfMed">
  <tr>
    <th>Medicine Name</th>
    <th>Course Duration</th>
    <th>Medicine Type</th>
    <th>Frequency</th>
    <th>Consumption</th>
  </tr>
  <tr>
    <td>${item.name}</td>
    <td>${fromD} to ${toD}</td>
    <td>${item.type}</td>
    <td>${item.frequency}</td>
    <td>${item.consumption}</td>
  </tr>
</table>
    </div>
    </body>
    </html>
`;
  } catch (error) {
    console.log('pdf generation error', error);
  }
};

export const createPDF = async item => {
  try {
    let PDFOptions = {
      html: await htmlContent(item),
      fileName: 'file',
      directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
    };
    let file = await RNHTMLtoPDF.convert(PDFOptions);
    if (!file.filePath) return;
    //alert(file.filePath);
    // PdfView(file.filePath);
    console.log('file', file);
    return file.filePath;
  } catch (error) {
    console.log('Failed to generate pdf', error.message);
  }
};

export const dayDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffTime = Math.abs(d1 - d2);
  const diffDays = Math.floor(diffTime / oneDay) + 1;
  console.log('diffDays', diffDays);
  return diffDays;
};
