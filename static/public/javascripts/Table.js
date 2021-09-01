import "/extLibs/jquery-3.4.1.min.js";

function _prepareHeader(header = '', asHtml = false) {

    if (!asHtml)
        header = document.createTextNode(header);

    return header;
}

class Table {

    /**
     * 
     * @param {} args optional object containg optional properties :
     * - {
     * - - tableElement : a jquery table object : (null)
     * - - options : {
     * - - - uniformColsWidth : Bool : True to set all cols to same width (false)
     * - - } (null)
     * - } 
     */
    constructor(args) {

        args = args || {};

        this._tableElement = args.tableElement || $('<table class="table table-dark table-striped table-hover mx-auto">');

        let options = args.options || {};

        this._options = {
            uniformColsWidth: options.uniformColsWidth || false
        };

        if (this._tableElement && this._tableElement.length == 0)
            throw 'table element is empty';

        this._tableElement.css({
            'width': 'max-content',
            'border-collapse': 'separate',
            'border-spacing': '0px'
        });

        if (this._tableElement.find('thead').length == 0)
            this._tableElement.append($('<thead>'));

        if (this._tableElement.find('tbody').length == 0)
            this._tableElement.append($('<tbody>'));

        this._rows = this._tableElement.find('tr').length;
        this._cols = this._tableElement.find('tr').eq(0).find('td,th').length;
    }

    getMaxWidth() {

        let tableCols = this._tableElement.find('tr').eq(0).find('td,th');

        let maxW = 0;

        for (let j = 1; j < tableCols.length; ++j) {
            let width = tableCols.eq(j).width();
            maxW = Math.max(width, maxW);

        }

        return maxW;
    }

    setColsWidth(colWidth) {

        let tableCols = this._tableElement.find('tr').eq(0).find('td,th');

        for (let j = 1; j < tableCols.length; ++j) {

            tableCols.eq(j).width(colWidth);

        }
    }

    /**
     * enable or disable uniformization of columns width
     * @param {bool} enableUniformColsWidth 
     */
    setUniformColsWidth(enableUniformColsWidth) {

        this._options.uniformColsWidth = !!enableUniformColsWidth;

        if (this._options.uniformColsWidth)
            this.setColsWidth(this.getMaxWidth());

    }

    /**
     * add an empty row to the table
     */
    addRow(header = '', asHtml = false) {

        header = _prepareHeader(header, asHtml);

        let row = $('<tr>');

        let firstColCell = $('<th scope="row">')
            .html(header);

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


        let thead = this._tableElement.find('thead');
        if (thead.find('tr').length == 0) {
            thead.append(row);
        } else {
            this._tableElement.find('tbody').append(row);
        }

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

        if (this._options.uniformColsWidth)
            this.setColsWidth(this.getMaxWidth());

    }

    /**
     * add a column with the given header to the table
     * @param {string} header Header of the column
     */
    addCol(header = '', asHtml = false) {

        header = _prepareHeader(header, asHtml);

        let thead = this._tableElement.find('thead');
        let firstRow = thead.find('tr');
        if (firstRow.length == 0) {
            firstRow = $('<tr>');
            thead.append(firstRow);
        }

        firstRow.append(
            $('<th scope="col">')
                .html(header)
        );

        let rows = this._tableElement.find('tbody tr');
        for (let i = 0; i < rows.length; ++i) {
            rows.eq(i).append($('<td>'));
        }

        if (this._options.uniformColsWidth)
            this.setColsWidth(this.getMaxWidth());

        ++this._cols;
    }

    appendTo(selector) {

        this.responsiveDiv
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

    get rawResponsiveDiv() {

        return $('<div class="table-responsive">')
            .append(this._tableElement);

    }
}

export default Table;
