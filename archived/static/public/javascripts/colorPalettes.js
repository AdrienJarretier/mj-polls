'use strict';

const COLORS_7 = [
    '#00935e', '#50b67f', '#9fd99f', '#effcc0', '#FBD989', '#e29e6d', '#c96251'
].reverse();

const COLORS_6 = [
    "#00935e", "#60bd85", "#bfe7ac", "#f6e79f", "#e7aa73", "#c96251"
].reverse();

export default {

    SELECTED_PALETTE: COLORS_6,

    color(index, palette) {
        return palette[index % palette.length];
    }

};
