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
            $('#edit-volume-' + i).removeClass( 'fa-check' );
            $('#edit-volume-' + i).addClass( 'fa-pencil-alt' );
            
            $('#volume-range-' + i).prop('disabled', true);
        })

        $('#submit-server-settings-' + i).click(function(){
            $('#volume-range-' + i).prop('disabled', false);
        })

    });


    $('.volume-edit-button').each(function(i){
        $('#edit-prefix-' + i).click( function(){

            if($(this).hasClass('fa-pencil-alt')){
                $(this).removeClass( 'fa-pencil-alt' );
                $(this).addClass( 'fa-check' );

                $('#prefix-char-' + i).prop('disabled', false);
                $('#prefix-char-' + i).removeClass('server-settings-input-disabled');
                $('#prefix-char-' + i).addClass('server-settings-input-enabled');
                $('#prefix-char-' + i).focus();
            }else{
                $('#prefix-char-' + i).removeClass('server-settings-input-enabled');
                $('#prefix-char-' + i).addClass('server-settings-input-disabled');

                $(this).removeClass( 'fa-check' );
                $(this).addClass( 'fa-pencil-alt' );

                $('#prefix-char-' + i).prop('disabled', true);
            }
            
        });

        $('#colapse-button-header-' + i).click(function(){
            $('#edit-prefix-' + i).removeClass( 'fa-check' );
            $('#edit-prefix-' + i).addClass( 'fa-pencil-alt' );

            $('#prefix-char-' + i).prop('disabled', true);
        })

        $('#submit-server-settings-' + i).click(function(){
            $('#prefix-char-' + i).prop('disabled', false);
        })
    });


    $('.role-edit-button').each(function(i){
        $('#edit-role-' + i).click( function(){

            if($(this).hasClass('fa-pencil-alt')){
                $(this).removeClass( 'fa-pencil-alt' );
                $(this).addClass( 'fa-check' );

                $('#standard-role-' + i).prop('disabled', false);
                $('#standard-role-' + i).removeClass('server-settings-input-disabled');
                $('#standard-role-' + i).addClass('server-settings-input-enabled');
                $('#standard-role-' + i).focus();
            }else{
                $('#standard-role-' + i).removeClass('server-settings-input-enabled');
                $('#standard-role-' + i).addClass('server-settings-input-disabled');

                $(this).removeClass( 'fa-check' );
                $(this).addClass( 'fa-pencil-alt' );

                $('#standard-role-' + i).prop('disabled', true);
            }
            
        });

        $('#colapse-button-header-' + i).click(function(){
            $('#edit-role-' + i).removeClass( 'fa-check' );
            $('#edit-role-' + i).addClass( 'fa-pencil-alt' );

            $('#standard-role-' + i).prop('disabled', true);
        })

        $('#submit-server-settings-' + i).click(function(){
            $('#standard-role-' + i).prop('disabled', false);
        })
    });

    
    $('.instruction-editor').each(function(i){
        $('.instruction-input-' + i).each( function(j){
            

            $('#edit-instructions-' + i + "-" + j).click( function(){

                if($(this).hasClass('fa-pencil-alt')){
                    $(this).removeClass( 'fa-pencil-alt' );
                    $(this).addClass( 'fa-check' );
    
                    $('#instruction-input-' + i + "-" + j).prop('disabled', false);
                    $('#instruction-input-' + i + "-" + j).removeClass('server-settings-input-disabled');
                    $('#instruction-input-' + i + "-" + j).addClass('server-settings-input-enabled');
                    $('#instruction-input-' + i + "-" + j).focus();
                }else{
                    $('#instruction-input-' + i + "-" + j).removeClass('server-settings-input-enabled');
                    $('#instruction-input-' + i + "-" + j).addClass('server-settings-input-disabled');
    
                    $(this).removeClass( 'fa-check' );
                    $(this).addClass( 'fa-pencil-alt' );
    
                    $('#instruction-input-' + i + "-" + j).prop('disabled', true);
                }

                $('#colapse-button-header-' + i).click(function(){
                    $('#edit-instructions-' + i + "-" + j).removeClass( 'fa-check' );
                    $('#edit-instructions-' + i + "-" + j).addClass( 'fa-pencil-alt' );

                    $('#instruction-input-' + i + "-" + j).prop('disabled', true);
                })

                $('#submit-server-settings-' + i).click(function(){
                    $('#instruction-input-' + i + "-" + j).prop('disabled', false);
                })
                
            });
        });
    });
});