//jQuery(document).ready(function(){
document.addEventListener('DOMContentLoaded',function(){
    var self = this;

    self.loadJScript = loadJScript;
    function loadJScript(value) {
        //$("head").append("<script src='" + value + "'></script>");
        jQuery.getScript(CTO_Globals.appURL + value)
            .done(function () {
                console.log("Load was performed..." + value);
            }).fail(function () {
                console.error("Error: Can't load " + value);
        });
    }

    jQuery.get(CTO_Globals.appURL + './cto.config.json', function (config) {
        console.log(config);
        for (let x = 0; x < config['styles'].length; x++) {
            jQuery("head").append("<link rel='stylesheet' href='" + CTO_Globals.appURL + config['styles'][x] + "' type='text/css'>");
        }

        let scripts = config['scripts'];
        for (let x = 0; x < scripts.length; x++) {
            if (typeof scripts[x].file === 'undefined') {
                self.loadJScript(scripts[x]);
            } else if (scripts[x].type === 'text/javascript' && scripts[x].file !== '../libs/appLoader.js') {
                self.loadJScript(scripts[x].file);
            }
        }
    }).done(function() {

        // first load translations
        jQuery.get(CTO_Globals.appURL + './locale.json', function (locale) {

            // get the right translations
            var data = locale[CTO_Globals.lang];

            // then get the table template which we want to inject later
            jQuery.get(CTO_Globals.appURL + './static.template.html', function (tableTemplate) {
                // add the template to build handlebars data
                data.adf_template = tableTemplate;
            }).fail(function() {
                console.log("Not Found static.template.html");
            }).always(function () {
                // then load the handlebars template
                jQuery.get(CTO_Globals.appURL + './template.hbs', function (hbsTemplate) {
                    // compile handlebars template
                    var tmpl = Handlebars.compile(hbsTemplate);
                    // inject translations & template
                    jQuery("#ctoAlgo").html(tmpl(data));

                    // load the start configuration
                    self.loadJScript('run.js');
                    
                }, 'html');
            });
        });
    });
});
