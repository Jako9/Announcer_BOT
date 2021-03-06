jQuery( document ).ready(function($) {

    $('#server-body').hide();

    $('#server-header').on('click', function(){
        $('#server-body').toggle();
    });

    $('#vip-header').on('click', function(){
        $('#vip-body').toggle();
    });

    let lastScrollTop = Cookies.get('reload-log-position');
    if (lastScrollTop) {
        $(window).scrollTop(lastScrollTop);
        Cookies.remove('reload-log-position');
    }




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


    $('.prefix-edit-button').each(function(i){
        $('#edit-prefix-' + i).click( function(){

            if($(this).hasClass('fa-pencil-alt')){
                $(this).removeClass( 'fa-pencil-alt' );
                $(this).addClass( 'fa-check' );

                $('#prefix-char-' + i).prop('disabled', false);
                $('#prefix-char-' + i).removeClass('server-settings-input-disabled');
                $('#prefix-char-' + i).addClass('server-settings-input-enabled');
                $('#prefix-char-' + i).focus();

                let fldLength= $('#prefix-char-' + i).val().length;
                $('#prefix-char-' + i)[0].setSelectionRange(fldLength, fldLength);
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

                let fldLength= $('#standard-role-' + i).val().length;
                $('#standard-role-' + i)[0].setSelectionRange(fldLength, fldLength);
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

    $('.reaction-role-edit-button').each(function(i){
        $('#edit-reaction-role-' + i).click( function(){

            if($(this).hasClass('fa-pencil-alt')){
                $(this).removeClass( 'fa-pencil-alt' );
                $(this).addClass( 'fa-check' );

                $('#reaction-role-' + i).prop('disabled', false);
                $('#reaction-role-' + i).removeClass('server-settings-input-disabled');
                $('#reaction-role-' + i).addClass('server-settings-input-enabled');
                $('#reaction-role-' + i).focus();

                let fldLength= $('#reaction-role-' + i).val().length;
                $('#reaction-role-' + i)[0].setSelectionRange(fldLength, fldLength);
            }else{
                $('#reaction-role-' + i).removeClass('server-settings-input-enabled');
                $('#reaction-role-' + i).addClass('server-settings-input-disabled');

                $(this).removeClass( 'fa-check' );
                $(this).addClass( 'fa-pencil-alt' );

                $('#reaction-role-' + i).prop('disabled', true);
            }
            
        });

        $('#colapse-button-header-' + i).click(function(){
            $('#edit-reaction-role-' + i).removeClass( 'fa-check' );
            $('#edit-reaction-role-' + i).addClass( 'fa-pencil-alt' );

            $('#reaction-role-' + i).prop('disabled', true);
        })

        $('#submit-server-settings-' + i).click(function(){
            $('#reaction-role-' + i).prop('disabled', false);
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

                    let fldLength= $('#instruction-input-' + i + "-" + j).val().length;
                    $('#instruction-input-' + i + "-" + j)[0].setSelectionRange(fldLength, fldLength);
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


    $('.sound-icon').each(function(i){
        $("#sound-button-" + i).click(function(){
            let id = $(this).data("id");
            $(this).replaceWith('<audio controls class="vip-sound-player"><source src="/resources/vips/'+ id +'.mp3" type="audio/mp3"> Your browser does not support the audio element. </audio>');
        
            $('.vip-sound-player').prop("volume", 0.3);
        });
    });

    
    $('#reload-debug').click(function(){
        $.get( "backend/logs/debug", function( data ) {
            $('#debug-log-viewer').html(data);
        });
    });

    $('#reset-debug-log').click(function(){
        $.post( "backend/logs/debug", function( data ) {
            $('#debug-log-viewer').html("");
        });
    });

    $('#reload-boot').click(function(){
        $.get( "backend/logs/boot", function( data ) {
            $('#boot-log-viewer').html(data);
        });
    });

    $('#reset-boot-log').click(function(){
        $.post( "backend/logs/boot", function( data ) {
            $('#boot-log-viewer').html("");
        });
    
    });

    $('#reload-error').click(function(){
        $.get( "backend/logs/error", function( data ) {
            $('#error-log-viewer').html(data);
        });
    });

    $('#reset-error-log').click(function(){
        $.post( "backend/logs/error", function( data ) {
            $('#error-log-viewer').html(data);
        });
    });

    $.get( "backend/logs/boot", function( data ) {
        $('#boot-log-viewer').html(data);
    });

    $.get( "backend/logs/error", function( data ) {
        $('#error-log-viewer').html(data);
    });

    $.get( "backend/logs/debug", function( data ) {
        $('#debug-log-viewer').html(data);
    });


    
    

    


    $('#debug-log-viewer').scrollTop($('#debug-log-viewer')[0].scrollHeight);
    $('#boot-log-viewer').scrollTop($('#boot-log-viewer')[0].scrollHeight);
    $('#error-log-viewer').scrollTop($('#boot-log-viewer')[0].scrollHeight);
});