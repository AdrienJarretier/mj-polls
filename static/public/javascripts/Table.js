class Table {

    constructor(tableElement) {
        this.tableElement = tableElement || $('<table>');
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

    addRow() {

        let row = $('<tr>');
        this.tableElement.append(row);
    }

    appendTo(selector) {

        this.tableElement.appendTo(selector);
    }

    get rowsCount() {

        return this.tableElement.find('tr').length;
    }
}
