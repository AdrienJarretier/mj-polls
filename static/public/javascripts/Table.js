import "/extLibs/jquery-3.4.1.min.js";

class Table {

    constructor(tableElement) {

        if (tableElement && tableElement.length == 0)
            throw 'table element is empty';

        this.tableElement = tableElement || $('<table class="table table-dark table-striped table-hover mx-auto">');

        this._tableElement = this.tableElement;

        if (this._tableElement.find('thead').length == 0)
            this._tableElement.append($('<thead>'));
        if (this._tableElement.find('thead tr').length == 0)
            this._tableElement.find('thead').append($('<tr>'));

        if (this._tableElement.find('tbody').length == 0)
            this._tableElement.append($('<tbody>'));

        this._rows = this._tableElement.find('tr').length;
        this._cols = this._tableElement.find('tr').eq(0).find('td,th').length;
    }

    getMaxWidth() {

        let tableCols = this.tableElement.find('tr').eq(0).find('td,th');

        let maxW = 0;

        for (let j = 1; j < tableCols.length; ++j) {
            let width = tableCols.eq(j).width();
            maxW = Math.max(width, maxW);

        }

        return maxW;
    }

    setColsWidth(colWidth) {

        let tableCols = this.tableElement.find('tr').eq(0).find('td,th');

        for (let j = 1; j < tableCols.length; ++j) {

            tableCols.eq(j).width(colWidth);

        }
    }

    /**
     * add an empty row to the table
     */
    addRow() {

        let row = $('<tr>');

        row.append($('<th scope="row">'));
        for (let j = 1; j < this.cols; ++j) {
            row.append($('<td>'));
        }

        this.tableElement.find('tbody').append(row);
        ++this._rows;
    }

    /**
     * add a column with the given header to the table
     * @param {string} header Header of the column
     */
    addCol(header) {

        this._tableElement.find('thead tr').append($('<th scope="col">').text(header));

        ++this._cols;
    }

    appendTo(selector) {

        this.tableElement.appendTo(selector);
    }

    get rows() {

        return this._rows;
    }

    get cols() {

        return this._cols;
    }
}

export default Table;
