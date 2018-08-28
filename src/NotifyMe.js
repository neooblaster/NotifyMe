/** ---------------------------------------------------------------------------------------------------------------- **
/** ---------------------------------------------------------------------------------------------------------------- **
/** ---                                                                                                          --- **
/** ---                                         ---------------------------                                      --- **
/** ---                                               { NotifyMe.js }                                            --- **
/** ---                                         ---------------------------                                      --- **
/** ---                                                                                                          --- **
/** ---        AUTEUR     : Nicolas DUPRE                                                                        --- **
/** ---                                                                                                          --- **
/** ---        RELEASE    : 28.08.2018                                                                           --- **
/** ---                                                                                                          --- **
/** ---        VERSION    : 1.1                                                                                  --- **
/** ---                                                                                                          --- **
/** ---                                                                                                          --- **
/** ---                                        -----------------------------                                     --- **
/** ---                                             { C H A N G E L O G }                                        --- **
/** ---                                        -----------------------------                                     --- **
/** ---                                                                                                          --- **
/** ---        VERSION 1.1 : 28.08.2018                                                                          --- **
/** ---        ------------------------                                                                          --- **
/** ---            - Première release                                                                            --- **
/** ---                                                                                                          --- **
/** ---        VERSION 1.0 : 20.12.2015                                                                          --- **
/** ---        ------------------------                                                                          --- **
/** ---            - Première release                                                                            --- **
/** ---                                                                                                          --- **
/** ---                               -----------------------------------------------------                      --- **
/** ---                                   { L I S T E      D E S      M E T H O D E S }                          --- **
/** ---                               -----------------------------------------------------                      --- **
/** ---                                                                                                          --- **
/** ---------------------------------------------------------------------------------------------------------------- **
/** ---------------------------------------------------------------------------------------------------------------- **

    Objectif de la fonction :
    -------------------------
        
    Description fonctionnelle :
    ---------------------------
    
        Reste à evaluer le comportement de 'sticky' et 'requireInteraction'
 
 
     new NotifyMe()
     new NotifyMe().title('Titre')
     new NotifyMe().title('Titre').message('Message')
     new NotifyMe().title('Titre').message('Message').options({icon: '/path/to/icon'})
     new NotifyMe().title('Titre').message('Message').options({icon: '/path/to/icon'}).send()

     

/** --------------------------------------------------------------------------------------------------------------- **
/** --------------------------------------------------------------------------------------------------------------- **/

function NotifyMe(){
    /** ------------------------------------------------------------------------------------------------------------ **
    /** ---                                                                                                      --- **
    /** ---                              Déclaration des propriétés de l'instance                                --- **
    /** ---                                                                                                      --- **
    /** ------------------------------------------------------------------------------------------------------------ **/
    var self = this;

    
    self.notif_title = null;    // Titre de la notification
    self.notif_message = null;  // Message à emettre
    self.notif_options = {};    // Options de configuration de la notification
    self.notif_ttl = null;      // Durée de vie de la notification
    self.notif_core = null;     // Instance de notification



    /** ------------------------------------------------------------------------------------------------------------ **
    /** ---                                                                                                      --- **
    /** ---                               Déclaration des méthodes de l'instance                                 --- **
    /** ---                                                                                                      --- **
    /** ------------------------------------------------------------------------------------------------------------ **/
    /** Méthode de définition de la durée de vie de la notification et donc indique de fermer **/
    self.close = function(ttl){
        if(ttl >= 0 && ttl < 2000){
            console.warn('NotifyMe.close() consider that '+ttl+'ms is too short to be usefull');
        }
        
        self.notif_ttl = ttl;
        return self;
    };
    
    /** Méthode qui indique les options existante **/
    self.help = function(){
        console.log('dir', '[String]:null', "The direction in which to display the notification. It defaults to auto, which just adopts the browser's language setting behaviour, but you can override that behaviour by setting values of ltr and rtl (although most browsers seem to ignore these settings.)");
        console.log('lang', '[String]:null', "The notification's language, as specified using a DOMString representing a BCP 47 language tag");
        console.log('tag', '[String]:null', "A DOMString representing an identifying tag for the notification.");
        console.log('icon', '[String]:null', "A USVString containing the URL of an icon to be displayed as part of the notification.");
        console.log('data', '[String]:null', "Arbitrary data that you want associated with the notification. This can be of any data type.");
        console.log('sound', '[String]:null', "A USVString containing the URL of an audio file to be played when the notification fires.");
        console.log('vibrate', '[Function]:null', "A vibration pattern for the device's vibration hardware to emit when the notification fires.");
        console.log('renotify', '[Boolean]:False', "A Boolean specifying whether the user should be notified after a new notification replaces an old one. The default is false, which means they won't be notified.");
        console.log('silent', '[Boolean]:False', "A Boolean specifying whether the notification should be silent, i.e. no sounds or vibrations should be issued, regardless of the device settings. The default is false, which means it won't be silent.");
        console.log('noscreen', '[Boolean]:False', "A Boolean specifying whether the notification firing should enable the device's screen or not. The default is false, which means it will enable the screen.");
        console.log('sticky', '[Bollean]:False', "A Boolean specifying whether the notification should be 'sticky', i.e. not easily clearable by the user. The default is false, which means it won't be sticky.");
        console.log('requireInteraction', '[Boolean]:False', "Indicates that on devices with sufficiently large screens, a notification should remain active until the user clicks or dismisses it. If this value is absent or false, the desktop version of Chrome will auto-minimize notifications after approximately eight seconds. The default value is false.");
        console.log('More details on MDN : https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification');
    };
    
    /** Méthode de définition du message de la notificaiton **/
    self.message = function(message){
        self.notif_message = message;
        
        return self;
    };
    
    /** Méthode de définition des options de configuration de la notification **/
    self.options = function(options){
        /** Gestion autonome des options **/
        /** SI c'est une chaine, alors est-elle parsable ?**/
        if(typeof(options) === 'string'){
            /** Essayer **/
            try {
                options = JSON.parse(options);
            } 
            /** Mettre fin à la fonction **/
            catch(e){
                console.error('NotifyMe.options() failed; The input param : "'+options+'" with typeof string can be parsed to JSON.');
                console.log('Error :', e);
                return false; // Stopper la function
            }
        }
        
        /** Parcourir les options : body exclus, car à sa méthode dédiée **/
        var recognize_options = ['dir', 'lang', 'tag', 'icon', 'data', 'sound', 'vibrate', 'renotify', 'silent', 'noscreen', 'sticky', 'requireInteraction'];
        
        for(var option in options){
            if(recognize_options.lastIndexOf(option) > 0){
                self.notif_options[option] = options[option];
            }
        }
        
        return self;
    };
    
    /** Méthode de demande d'autorisation des notificaiton **/
    self.request = function(callback){
        if(Notification.permission !== 'granted'){
            Notification.requestPermission(callback);
        } else {
            console.log("NotifyMe.request() no request for authorization, because it's already allowed.");
        }
    };
    
    /** Méthode d'émission de la notification **/
    self.send = function(){
        /** Contrôler que le navigateur est compatible **/
        if('Notification' in window){
            /** Controler le niveau d'autorisation **/
            if(Notification.permission !== 'denied'){
                /** Si la permission est statuée par défaut, alors demander la permission **/
                if(Notification.permission === 'default'){
                    self.request(self.send);
                }
                
                /** Emettre la notification **/
                else {
                    /** Emettre uniquement si on dispose au moins du titre et du message **/
                    if(self.notif_title !== null){
                        if(self.notif_message !== null){
                            self.notif_options.body = self.notif_message;
                            
                            self.notif_core = new Notification(self.notif_title, self.notif_options);
                            
                            if(self.notif_ttl !== null && self.notif_ttl >= 0){
                                setTimeout(self.notif_core.close.bind(self.notif_core), self.notif_ttl);
                            }
                        }
                        /** Message Manquant **/
                        else {
                            console.warn('NotifyMe.send() can\'t be executed. The message is missing. Use Method message($message) to set a title.');
                        }
                    }
                    /** Titre Manquant **/
                    else {
                        console.warn('NotifyMe.send() can\'t be executed. The title is missing. Use Method title($title) to set a title.');
                    }
                }
            }
            
            /** Loguer le refus d'émettre la notif **/
            else {
                console.warn('NotifyMe.send() can\'t be executed. Notifications are not allowed.');
            }
        }
        
        /** Emettre une sortie console **/
        else {
            console.warn('NotifyMe.send() can\'t be executed. The Notification system is not available with self browser.');
        }
        
    };
    
    /** Méthode de définition du titre de la notification **/
    self.title = function(title){
        self.notif_title = title;
        
        return self;
    };


    /** ------------------------------------------------------------------------------------------------------------ **
    /** ---                                                                                                      --- **
    /** ---                               Execution interne de l'instance                                 --- **
    /** ---                                                                                                      --- **
    /** ------------------------------------------------------------------------------------------------------------ **/
    return self;
}