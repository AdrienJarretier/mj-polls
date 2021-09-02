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
        if (this.cols == 0)
            ++this._cols;
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
     * @param {boolean} asHtml if True, will NOT escape html special chars
     * @param {number | string} duration A string or number
     * determining how long the animation will run. Default to 0
     */
    addCol(header = '', asHtml = false, duration = 0) {

        header = _prepareHeader(header, asHtml, duration);

        if (!asHtml) {
            header = $('<span>').append(header);
        }

        let thead = this._tableElement.find('thead');
        let firstRow = thead.find('tr');
        if (firstRow.length == 0) {
            firstRow = $('<tr>');
            thead.append(firstRow);
            ++this._rows;
        }

        let newCell = $('<th scope="col">')
            .html(header);

        firstRow.append(
            newCell
        );

        let rows = this._tableElement.find('tbody tr');
        for (let i = 0; i < rows.length; ++i) {
            rows.eq(i).append(
                $('<td>')
            );
        }

        if (this._options.uniformColsWidth)
            this.setColsWidth(this.getMaxWidth());

        header
            .hide()
            .show(duration);

        ++this._cols;
    }

    /**
     * Remove column j
     * @param {number} j Number of the col to remove
     * @param {number | string} duration A string or number
     * determining how long the animation will run. Default to 0
     */
    removeCol(j, duration = 0) {

        if (j < 1)
            throw "Can't remove header column";

        let rows = this._tableElement.find('tr');
        for (let i = 0; i < rows.length; ++i) {

            let cell = rows.eq(i).find('td, th').eq(j);

            let children = cell.children();

            cell.hide(duration, function () {
                cell.remove();
            });

            if (children.length > 0) {
                children.hide(duration);
            }

        }
        --this._cols;
    }

    appendTo(selector) {

        this.rawResponsiveDiv
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
