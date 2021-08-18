'use strict';

export default {

    COLORS_7: [
        '#00935e', '#50b67f', '#9fd99f', '#effcc0', '#FBD989', '#e29e6d', '#c96251'
    ].reverse(),

    color(index, palette) {
        return palette[index % palette.length];
    }

};
