/*
 * jquery.urlive.js v1.1.1, jQuery URLive
 *
 * Copyright 2014 Mark Serbol.   
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the MIT license, available at http://www.opensource.org/licenses/MIT.
 *
 * https://github.com/markserbol/urlive
 *
 */

;(function($){
	var defaults = {
		container: '.urlive-container',
		target: '_blank',
		imageSize: 'small',
		render: true,
		disableClick: false,
		regexp: /((https?:\/\/)?[\w-@]+(\.[a-z]+)+\.?(:\d+)?(\/\S*)?)/i,
		yqlSelect: '*',
		callbacks: {
			onStart: function() {},
			onSuccess: function() {},
			onFail: function() {},
			noData: function() {},
			onLoadEnd: function() {},
			imgError: function() {},
			onClick: function() {}
		}
	},
	
	xajax = (function(ajax){		
		var exRegex = RegExp(window.location.protocol + '//' + window.location.hostname),
			yql_base_uri = 'http'+(/^https/.test(window.location.protocol)?'s':'') + 
			               '://query.yahooapis.com/v1/public/yql?callback=?',
			yql_query = 'select {SELECT} from html where url="{URL}" and xpath="*" and compat="html5"';
		
		return function(o) {		
			var url = (!/^https?:\/\//i.test(o.url)) ? window.location.protocol + '//' + o.url : o.url;	
          
			if (/get/i.test(o.type) && !/json/i.test(o.dataType) && !exRegex.test(url) && /:\/\//.test(url)){			
			
				o.url = yql_base_uri;
				o.dataType = 'json';			
				o.data = {
					q: yql_query.replace('{SELECT}', o.yqlSelect).replace(
						'{URL}',
						url + (o.data ? (/\?/.test(url) ? '&' : '?') + $.param(o.data) : '')
					),
					format: 'xml'
				};

				if (!o.success && o.complete) {
					o.success = o.complete;
					delete o.complete;
				}
				
				o.success = (function(success){
					return function(data){						
						if(success){							
							success.call(this, {
								responseText: (data.results[0] || '').replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
							}, 'success');
						}
							
					};
				})(o.success);
					
			}		
			return ajax.apply(this, arguments);				
		};
		
	})($.ajax),	
	
	findUrlive = function(){
		var selector = $(this).data('urlive-container') || $(this);		
		return $(selector).find('.urlive-link');
	},
	
	methods = {
		init: function(options,professor,course,search){
			var opts = $.extend(true, defaults, options);
			//console.log(this);
			return this.each(function(){
				var el = $(this), url = undefined;
				el.data('urlive-container', opts.container);

				var showOrNot = 0;
				var thisID = $(this).attr('id');
				var thisIDArr = thisID.split('+');
				var ans = ["","","",""];
				var color = ["","",""];
				var ansdiv;
				ans[0] = thisIDArr[0]+'%';
				ans[1] = thisIDArr[1]+'%';
				ans[2] = thisIDArr[2]+'%';
				ans[3] = thisIDArr[3];
				//console.log(thisID);
				// /console.log(ans[3]);
				//console.log(ans[0]+" "+ans[1]+" "+ans[2]);
				if(thisIDArr[0]>=66)	color[0] = "style=\"background-color:#5BD7AD;\"";
				else if(thisIDArr[0]<66 && thisIDArr[0]>=33)	color[0] = "style=\"background-color:#FCFF7C;\"";
				else	color[0] = "style=\"background-color:#FF7579;\"";
				if(thisIDArr[1]>=66)	color[1] = "style=\"background-color:#5BD7AD;\"";
				else if(thisIDArr[1]<66 && thisIDArr[1]>=33)	color[1] = "style=\"background-color:#FCFF7C;\"";
				else	color[1] = "style=\"background-color:#FF7579;\"";
				if(thisIDArr[2]>=66)	color[2] = "style=\"background-color:#5BD7AD;\"";
				else if(thisIDArr[2]<66 && thisIDArr[2]>=33)	color[2] = "style=\"background-color:#FCFF7C;\"";
				else	color[2] = "style=\"background-color:#FF7579;\"";

				if(search==1){
					var professorInd = ans[3].indexOf(professor);
					var courseInd = ans[3].indexOf(course);
					if(professorInd>0 || courseInd >0)	showOrNot = 1;
				}
				//red:#FF7579
				//green:#5BD7AD
				//yellow:#FCFF7C

				ansdiv = "<span class = \"circle_container\">"
							+  "<div class=\"circle\""+		color[0]	+"><h3>"+ans[0]+"</div>"  
							+  "<div class=\"circle\""+		color[1]	+"><h3>"+ans[1]+"</div>"  
							+  "<div class=\"circle\""+		color[2]	+"><h3>"+ans[2]+"</div>"  
							+  "</span>";
				//ansdiv = "<div class=\"circle\"><h3>"+ans[0]+"</div>"  +  "<div class=\"circle\"><h3>"+ans[1]+"</div>"  +  "<div class=\"circle\"><h3>"+ans[2]+"</div>";
				//console.log(color[0]+ " " +color[1]+ " " +color[2]+ " " );
								
				if(el.is('a')){
					url = el.attr('href');
				}else{
					var text = el.val() || el.text(), 
						regexp = opts.regexp, 
						email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				
					url = regexp.exec(text);
					
					url = (url && !email.test(url[0])) ? url[0] : null;			
				}
				
				if(url){
					if(/\.(?:jpe?g|gif|png)/.test(url)){
						var ti = url.substr(url.lastIndexOf('/') + 1);
						draw({image:url, title:ti, url:url});
					}else{
						getData(url);
					}
				}
						
				function getData(url){					
					xajax({
						url: url,
						type: 'GET',
						yqlSelect: opts.yqlSelect,
						beforeSend: opts.callbacks.onStart				
					}).done(function(data){
						if(!$.isEmptyObject(data.results)){
							data = data.results[0];
							
							html = $('<div/>',{html:data});
		
							get = function(prop){	
								return html.find('[property="' + prop + '"]').attr('content') 
											 || html.find('[name="' + prop + '"]').attr('content') 
											 || html.find(prop).html() || html.find(prop).attr('src');
							};
											
							set = {
								image: el.data('image') || get('og:image') || get('img'), 
								title: el.data('title') || get('og:title') || get('title'), 
								description: el.data('description') || get('og:description') || get('description'),
								url: el.data('url') || get('og:url') || url,	
								type: el.data('type') || get('og:type'),				
								sitename: el.data('site_name') || get('og:site_name'),
							};
							
							opts.callbacks.onSuccess(set);
							
							if(opts.render){
								draw(set);
							}
												
						}else{
							opts.callbacks.noData();
							$.error('YQL request succeeded but with empty results', data);
							
						}
					}).fail(function (jqXHR, textStatus, errorThrown) {
						opts.callbacks.onFail();
						$.error('YQL request error: ', textStatus, errorThrown);		
					});			
				}
				
				function draw(set){		
					outer = $('<a/>',{ 'class':'urlive-link', href: set.url, target: opts.target});
					//imgWrapper = $('<div/>',{ 'class':'urlive-img-wrapper'});
					textWrapper = $('<div/>',{'class':'urlive-text-wrapper'});
					
					$.each(set, function(key, val){
						if(val){
							if((key != 'image') && (key != 'description') && (key != 'sitename')){
								elem = $('<span/>', {'class':'urlive-'+key, text: val});								
								elem.appendTo(textWrapper);
							}
						}
					});
					if(showOrNot==1||search==0){
						$(ansdiv).appendTo(el.data('urlive-container'));
					
						right_container = $('<span/>', {'class':'right_container'});
						right_container.appendTo(el.data('urlive-container'));
						outer.append(textWrapper);
						outer.appendTo(right_container);
						//outer.append(imgWrapper, textWrapper).appendTo(el.data('urlive-container'));
						
						outer.on('click', opts.callbacks.onClick);
						
						if(opts.disableClick){
							outer.on('click', function(e){
								e.preventDefault();
							});
						}
					}
				}
				
			});
		},
		
		close: function(duration){
			var urlive = findUrlive.apply(this);
			
			urlive.fadeOut(duration);	
		},
		
		remove: function(duration){
			var urlive = findUrlive.apply(this);
			
			if(duration){
				urlive.fadeOut(duration, function(){
					urlive.remove();
				});	
			}else{
				urlive.remove();
			}
		},
				
		open: function(duration){
			var urlive = findUrlive.apply(this);
			
			urlive.fadeIn(duration);	
		},
		
		disable: function(){
			var urlive = findUrlive.apply(this);
			
			urlive.on('click',function(e) {
        e.preventDefault();
      });	
		},
		
		enable: function(){
			var urlive = findUrlive.apply(this);
			
			urlive.off('click');	
		}
		
	};
	
	$.fn.urlive = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || !method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method "' + method + '" does not exist on jquery.urlive');
		}
	};
	
})(jQuery);