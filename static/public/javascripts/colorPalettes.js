'use strict';

// const COLORS_7 = [
//     '#00935e', '#50b67f', '#9fd99f', '#effcc0', '#FBD989', '#e29e6d', '#c96251'
// ].reverse();


// const COLORS_3 = [
//     "#df8568", "#f8e6b5", "#54a062"
// ].reverse();

// const COLORS_5 = [
//     "#df8568", "#feb39a", "#f8e6b5", "#7ebc89", "#54a062"
// ].reverse();



export default {

    COLORS_7: [
        '#00935e', '#50b67f', '#9fd99f', '#effcc0', '#FBD989', '#e29e6d', '#c96251'
    ].reverse(),

    color(index, palette) {
        return palette[index % palette.length];
    }

};
