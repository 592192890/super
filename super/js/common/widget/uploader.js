/**
 * H5 Uploader implements
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Uploader = require('lib/plugins/uploader/1.0.0/uploader');
    var Dialog = require('common/ui/dialog/dialog');
    var Box = require('lib/ui/box/1.0.1/box');

    window.fileUploadObj=[];

    /**
     * Render upload file preview image view and staffs.
     */
    var renderFilePreview = function(oFile, container, uploader) {
        var $el = container;

        // generate preview image src
        Uploader.genImageFileThumbnail(oFile, $el, function(src) {

            var $element=$el;
            
            var img = new Image();

            img.src = src;
            img.onload = function() {
                // central image visiable
                $(img).css({
                    // top: (clipSize.height - img.height) / 2,
                    top:0,
                    left: 0,
                    position: 'absolute',
                    height:'100%'
                });
                img = img.onload = null;
            };

            $element.find('.ui-button').find('.add-upload-txt').remove();
            $element.find('.ui-button').append(img);

            // add close button
            // var closeButton = $('<b class="icon-delete"></b>');
            var closeButton = $('<i class="iconfontmod icon icon-delete" file-id="'+$element.find('input').attr('file-id')+'" style="margin:0px;">&#xe76a;</i>');
            closeButton.one('click', function(e) {
                var fileId=closeButton.attr('file-id');
                //删除fileUploadObj对应的文件对象
                var newFileUploadObj=[];
                for(var i=0;i<fileUploadObj.length;i++){
                    var item=fileUploadObj[i];
                    if(fileId!=item.fileId){
                        newFileUploadObj.push(item);
                    }
                }
                fileUploadObj=newFileUploadObj;
                //如果5个文件删除一个时，需要让文件上传按钮显示
                if(parseInt(sessionStorage.getItem('fileCount'))==5){
                    $('#jFileButton').show();
                    
                }
                //fileCount减少
                var fileCount=parseInt(sessionStorage.getItem('fileCount'))-1;
                sessionStorage.setItem('fileCount',fileCount);

                $element.remove();
                var $mask = $element.find('.progressbar');
                closeButton.remove();
                $mask && $mask.remove();
                closeButton = container = $element = null;
                uploader.emit('imageremoved');
            }.bind(this));

            $element.find('.ui-button').append(closeButton).addClass('file-uploaded');
        }.bind(this));
    };

    var fileFilter = function(file) {
        var type = file.get('type');
        var size = file.get('size');

        //判断文件大小是否超过2M
        if (size >= 2 * 1024 * 1024) {
            Box.alert('上传的图片不能大于2M!');
            return false;
        }

        return /^image\//.test(type);
    };

    var createProcessBar = function() {
        var el = $('<div class="process-bar-container"><div class="process-bar"></div></div>');
        return el;
    };

    module.exports = function(el, options) {
    
        sessionStorage.setItem('fileCount','0');//upload file count<5

        // initialize file upload component
        var uploader = new Uploader(el, {
            uploadURL: options.endpoint,
            uploadOnSelect: false,
            accept: 'image/*',
            fileFilter: fileFilter,
            multiple: true
        });

        function showLayoutByFiles(fileList){
            //遍历新上传的files
            for(var i=0;i<fileList.length;i++){
                var file = fileList && fileList[i], oFile;
                var uploadingFileSize = file.get('size');

                var strHTML='<div class="id-img add-div" style="position: relative; overflow: hidden; direction: ltr;">'+
                    '<input type="hidden" file-id="'+file.get('id')+'"file-name="'+file.get('file').name+'">'+
                    '<a href="javascript:;" class="ui-button">'+
                        '<div class="add-upload-txt">上传中</div>'+
                    '</a>'+
                '</div>';
                $('#jAddFile').prepend(strHTML);
                var el=$('.add-div:first');

                
                var processBar = createProcessBar().appendTo($(el)).find('.process-bar');
                
                //status:(0为默认值，1为上传成功，-1为上传失败)
                fileUploadObj.push({
                    fileId:file.get('id'),
                    uploadingFileSize:uploadingFileSize,
                    processBar:processBar,
                    status:0
                });

                if (file && (oFile = file.get('file'))) {
                    // generate preview image and staffs
                    renderFilePreview(oFile, el, uploader,'addFile');
                }
              
            }
           
        }
        function doUpload(e) {
            var fileList=e.fileList;
            
           
            var fileCount=parseInt(sessionStorage.getItem('fileCount'));
            var newFileCount=fileCount+fileList.length;
            
            //判断文件上传个数是否超过5
            if(newFileCount>5){
                Box.alert("文件上传个数不得超过5个");
                return;
            }else if(newFileCount==5){
                //隐藏上传文件按钮
                $("#jFileButton").hide();
            }
            
            sessionStorage.setItem('fileCount',newFileCount);//统计上传文件个数

            uploader.uploadThese(fileList);
            //根据文件类型显示样式
            showLayoutByFiles(fileList);
            //最后一个元素右外边框0px
            // $('.add-div:last').css('marginRight','10px');
            
        }
        

        uploader.on('fileselect', function(e) {
            // checkForUpload(e);
            doUpload(e);
        });

        uploader.on('uploadprogress', function(e) {
            var fileId=e.file.get('id');

            for(var i=0;i<fileUploadObj.length;i++){
                var item=fileUploadObj[i];
                if(fileId==item.fileId){
                    
                    var processBar=item.processBar;
                    var uploadingFileSize=item.uploadingFileSize;
                    break;
                }
            }

            var percentLoaded = Math.min(100, Math.round(10000*e.bytesLoaded/uploadingFileSize)/100);
            e.bytesTotal = uploadingFileSize;
            e.percentLoaded = percentLoaded;

            var percent = percentLoaded + '%';
            processBar.parent().width(percent);
            //console.log(percentLoaded + ',' + e.bytesLoaded + ',size=' + e.file.get('size') + ',uploadingFileSize=' + uploadingFileSize);
        });

        uploader.on('uploadcomplete', function(e) {
    
            var res = e.data || {};
            if (res.code == "1") {

                var fileId=e.file.get('id');
                for(var i=0;i<fileUploadObj.length;i++){
                    var item=fileUploadObj[i];
                    if(fileId==item.fileId){
                        //修改状态
                        item.status=1;
                    
                        var processBar=item.processBar;
                        break;
                    }
                }
                //remove processbar
                processBar.parent().remove();
            
                //insert url to hidden input
                $('[file-id="'+fileId+'"]').val(res.url);
            } else {
                var fileId=e.file.get('id');
                for(var i=0;i<fileUploadObj.length;i++){
                    var item=fileUploadObj[i];
                    if(fileId==item.fileId){
                        //修改状态
                        item.status=-1;

                        var processBar=item.processBar;
                        break;
                    }
                }

                processBar.parent().parent().find('a').append('<div class="upload-error">文件上传失败</div>');
                processBar.parent().remove();
                // Box.alert(res.msg || '图片上传失败');
                       
            }
        });

        uploader.on('uploaderror', function(e) {
            var fileId=e.file.get('id');
            for(var i=0;i<fileUploadObj.length;i++){
                var item=fileUploadObj[i];
                if(fileId==item.fileId){
                    //修改状态
                    item.status=-1;
                    var processBar=item.processBar;
                    break;
                }
            }
            processBar.parent().parent().find('a').append('<div class="upload-error">文件上传失败</div>');
         
            processBar.parent().remove();

            // var fileCount=parseInt(sessionStorage.getItem('fileCount'))-1;
            // sessionStorage.setItem('fileCount',fileCount)//文件上传失败
            // console.log('upload fails');
            // Box.alert('图片上传失败')
        });

        return uploader;
    };

});
