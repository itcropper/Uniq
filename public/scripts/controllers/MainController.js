

(function($){
    
    var $fileInput = $('input[type="file"]'),
        $inputBox = $('.zone'),
        $form = $('#upload-form'),
        $submitBtn = $('.btn.submit'),
        $title = $('.js-filename'),
        $resTable = $('.response-table');
    
    
    $(document).on('submit', '#upload-form', function(e) {
        e.preventDefault();
         
        var data = new FormData();
        
        data.append('file', $fileInput[0].files[0],$fileInput[0].files[0].name); 
        data.append('exclude', $form.find('input[name="exclude"]').is(":checked"));
        
        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            processData:false,
            enctype:"multipart/form-data",
            contentType: false,
            data: data,
            success: function(res) {
                $inputBox.hide('fast');
                $resTable.removeClass('hidden')
                $resTable.find('tbody').html(res.map(row => `
                    <tr>
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                    </tr>`
                ).join(""));
                
                $resTable.find('table').tablesorter({
                    theme : "bootstrap",
                    widthFixed: true,

                    // widget code contained in the jquery.tablesorter.widgets.js file
                    // use the zebra stripe widget if you plan on hiding any rows (filter widget)
                    // the uitheme widget is NOT REQUIRED!
                    widgets : [ "filter", "columns", "zebra" ],    
                    widgetOptions : {
                        zebra : ["even", "odd"],
                        filter_reset : ".reset",
                        filter_cssFilter: [
                            'form-control',
                            'form-control',
                            'form-control custom-select', // select needs custom class names :(
                            'form-control',
                            'form-control',
                            'form-control',
                            'form-control'
                        ]                        
                    }
                });
            }
        });
        
    });
    
    $fileInput.on('change', function(e){
        if(e && e.target && e.target.files && e.target.files.length && e.target.files[0].name){
            $submitBtn.attr('disabled', false);   
            $submitBtn.attr('title', '');
        }else{
            $submitBtn.attr('disabled', true);
            $submitBtn.attr('title', 'select a file first');
        }
        $title.text(e.target.files[0].name);
    });
    
    
})(jQuery)

$(function() {
    $('.tooltip-wrapper').tooltip({position: "bottom"});
});