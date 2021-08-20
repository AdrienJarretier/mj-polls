import "/extLibs/jquery-3.4.1.min.js";

class Table {

    constructor(tableElement) {

        if (tableElement && tableElement.length == 0)
            throw 'table element is empty';

        this.tableElement = tableElement || $('<table class="table table-dark table-striped table-hover mx-auto">');

        this._tableElement = this.tableElement;

        this._tableElement.css({
            'width': 'max-content',
            'border-collapse': 'separate',
            'border-spacing': '0px'
        });

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

        let firstColCell = $('<th scope="row">');
        firstColCell.css(
            {
                'left': '0',
                'border-right': '1px solid #6c757d'
            }
        );
        firstColCell.addClass('position-sticky');

        row.append(firstColCell);
        for (let j = 1; j < this.cols; ++j) {
            row.append($('<td>'));
        }

        this.tableElement.find('tbody').append(row);
        ++this._rows;

        return row;
    }

    /**
     * Set the content the cell i,j
     * @param {number} i line of the cell
     * @param {number} j column of the cell
     * @param {*} content content to put in the cell
     */
    setContent(i, j, content) {
        i = parseInt(i);
        j = parseInt(j);

        let rows = this._tableElement.find('tr');
        let row = rows.eq(i);

        for (let k = rows.length - 1; k < i; ++k) {
            row = this.addRow();
        }

        for (let l = row.find('td,th').length - 1; l < j; ++l) {
            this.addCol();
        }

        let cell = row.find('td, th').eq(j);
        cell.html(content);

    }

    /**
     * add a column with the given header to the table
     * @param {string} header Header of the column
     */
    addCol(header) {

        this._tableElement.find('thead tr').append($('<th scope="col">').text(header));

        let rows = this._tableElement.find('tbody tr');
        for (let i = 0; i < rows.length; ++i) {
            rows.eq(i).append($('<td>'));
        }

        ++this._cols;
    }

    appendTo(selector) {

        $('<div class="table-responsive">')
            .append(this._tableElement)
            .appendTo(selector);
    }

    /**
     * Add css class to table
     * @param {string} cssClass css class
     */
    addClass(cssClass) {
        this._tableElement.addClass(cssClass);
    }

    get rows() {

        return this._rows;
    }

    get cols() {

        return this._cols;
    }
}

export default Table;
