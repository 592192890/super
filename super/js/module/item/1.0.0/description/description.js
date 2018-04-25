/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 * @modify  yanghaitao
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');

    var $ItemDescWrap = $('#jItemDescWrap');
    var $ItemDesc = $('#jItemDesc');
    if ($ItemDesc.height() > $ItemDescWrap.height()) {
        $ItemDescWrap.addClass('show-expand');
    }
    $('#jBtnToggleExp').on('click', function() {
        $ItemDescWrap.toggleClass('expanded');
    });
    if ($ItemDesc.html() === '' || $ItemDesc.find('span').html() === '') {
        $ItemDescWrap.hide();
    }

});
