"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Pdf_1 = require('Pdf');
var FileItem = (function (_super) {
    __extends(FileItem, _super);
    function FileItem(props) {
        _super.call(this, props);
        this.default = FileItem;
        var fileTypes = [
            {
                id: 'PDF',
                label: 'pdf',
                name: 'aaa.pdf'
            },
            {
                id: 'DOC',
                label: 'documents',
                name: 'bbb.docx'
            },
            {
                id: 'IMG',
                label: 'images',
                name: 'ccc.jpg'
            },
            {
                id: 'AUD',
                label: 'audios',
                name: 'ddd.mp3'
            },
            {
                id: 'VID',
                label: 'videos',
                name: 'eee.mp4'
            },
            {
                id: 'OTH',
                label: 'others',
                name: 'fff.apk'
            }
        ];
        var fileTypes = this.props.fileTypes;
        var renderFiletypes = function () {
            return fileTypes.map(function (filetype) {
                return (<Pdf_1["default"] key={filetype.id}/>);
            });
        };
        render();
        {
            return (<div>
          {renderFiletypes()}
        </div>);
        }
    }
    return FileItem;
}(React.Component));
//# sourceMappingURL=index.js.map