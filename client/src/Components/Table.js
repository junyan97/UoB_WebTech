import React from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

class Table extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      tableData:props.tableData,
    }
  }

  render() {

    const theme = createMuiTheme({
        palette: {type: 'dark'},
        typography: {useNextVariants: true},
    });
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <MUIDataTable
          title={"Countries"}
          data={this.state.tableData.data}
          columns={this.state.tableData.columns}
          options={
            this.state.tableData.option,
            {
              onRowsDelete: (rowsDeleted) => {
                const data = this.state.tableData.data;
                const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex][0]); // array of all ids to to be deleted
                fetch('/api/stat/deleteCountry', {
                  method: 'post',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    countryName: idsToDelete
                  })
              })
              .then(response => response.json())
              .then(response => {
                if(response.response){
                  console.log("success");
                }
              })
              console.log(idsToDelete);
                //http.delete(idsToDelete, res).then(window.alert('Deleted!')); // your delete request here
              }
            }
          }
        />
        </MuiThemeProvider>
      </div>
      
    );
  }
}

export default Table;
