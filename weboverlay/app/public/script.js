jQuery( document ).ready(function($) {
    $('.volume-edit-button').each(function(i){
        $('#range-val-' + i).text(
            $('#volume-range-' + i).val() * 100 + "%"
        );

        $('#volume-range-' + i).on('input', function(){
            $('#range-val-' + i).text(
                $('#volume-range-' + i).val() * 100 + "%"
            );
        });

        $('#edit-volume-' + i).click( function(){

            if($(this).hasClass('fa-pencil-alt')){
                $(this).removeClass( 'fa-pencil-alt' );
                $(this).addClass( 'fa-check' );

                $('#volume-range-' + i).prop('disabled', false);
            }else{
                $(this).removeClass( 'fa-check' );
                $(this).addClass( 'fa-pencil-alt' );

                $('#volume-range-' + i).prop('disabled', true);
            }
            
        });

        $('#colapse-button-header-' + i).click(function(){
            $('#volume-range-' + i).prop('disabled', true);
        })

        $('#submit-server-settings-' + i).click(function(){
            $('#volume-range-' + i).prop('disabled', false);
        })
    });

});