CKEDITOR.editorConfig = function( config )
{
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';    
    //config.extraPlugins = 'auroraWidgets,auroraCancel'; 
    config.toolbar='Basic';
    config.language = "en.js";   
    config.skin = 'office2003';
    config.toolbar = 'MyToolbar';
   // config.scayt_autoStartup = true;                                         
    config.resize_enabled = false;
    config.removePlugins = 'elementspath';
    config.toolbarCanCollapse = false;
    config.dialog_backgroundCoverColor = 'rgb(0, 0, 0)';
    config.bodyId = 'themeAuroraBody';
    //config.emailProtection = 'mt(NAME,DOMAIN,SUBJECT,BODY)';
    config.filebrowserUploadUrl = '/request/upload/';
    config.contentsCss = [SETTINGS.scriptPath+'themes/aurora/style.css'];
    config.startupShowBorders = false;
    config.entities = false;
    config.basicEntities = false;
    config.fullPage = false;
    config.startupOutlineBlocks = false;
    config.uiColor = '#FFFFFF';//063777
    config.startupFocus = false;
    var normalFontStyle = { name : 'Normal Text', element : 'p'};
    config.stylesSet = [
                        {name : 'Heading', element : 'h1'},{name : 'Heading 2', element : 'h2'},{name : 'Heading 3', element : 'h2'},
                       normalFontStyle
                       ];
 config.font_style = normalFontStyle;

    config.toolbar_MyToolbar =
    [        
    ['Source','AjaxSave','AuroraCancel','Undo','Redo', 'Cut','Copy','Paste'],
    ['Image','Table','HorizontalRule','SpecialChar', 'Link','Unlink'],
    ['NumberedList','BulletedList','Outdent','Indent'],              //'-',
    ['Bold','Italic','Underline','Strike', 'Subscript','Superscript', 'JustifyLeft','JustifyCenter','JustifyRight', 'TextColor','BGColor'],
    ['Styles','Font','FontSize'],
    ];
};