$(document).ready(function(){
	$('.form_date').datetimepicker({
        locale: 'es',
		language:'es',
		format: 'yyyy-mm-dd hh:ii:00',
		todayBtn:true,
		clearBtn:true,
    });

	$('.form_date2').datetimepicker({
        locale: 'es',
		language:'es',
		format: 'dd-mm-yyyy hh:ii:00',
		todayBtn:true,
		clearBtn:true,
    });

	$('.example').flexTabs({
		transformFade: 250,
		beforeChange: function(sets, curItem, nextItem) {
			if( sets.curMode == 'mobile' ) {
				nextItem.content.css({
					display: 'block'
				});
			}

		},
		afterChange: function(sets, curItem) {
			if( sets.curMode == 'desktop' ) {
				curItem.content.hide().fadeIn(250);
			}
			if( sets.curMode == 'mobile' && curItem.content.hasClass('active') ) {
				curItem.content.hide().slideDown(350);
			}
			if( sets.curMode == 'mobile' && !curItem.content.hasClass('active') ) {
				curItem.content.slideUp(350);
			}
		},
		onChangeMode: function(sets) {
			console.log( ': ', sets );
		}
	});

});
