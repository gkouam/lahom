export type Language = 'en' | 'fr'

export const translations: Record<string, { en: string; fr: string }> = {
  // Navigation
  'nav.heritage': { en: 'Heritage', fr: 'Patrimoine' },
  'nav.culture': { en: 'Culture', fr: 'Culture' },
  'nav.events': { en: 'Events', fr: 'Événements' },
  'nav.gallery': { en: 'Gallery', fr: 'Galerie' },
  'nav.leadership': { en: 'Leadership', fr: 'Direction' },
  'nav.join': { en: 'Join Us', fr: 'Rejoignez-nous' },

  // Hero
  'hero.eyebrow': { en: 'Kingdom of Baham · Cameroon Grassfields', fr: 'Royaume de Baham · Grassfields du Cameroun' },
  'hero.title': { en: 'Preserving Our<br><i>Baham</i> Heritage', fr: 'Préserver Notre<br>Patrimoine <i>Baham</i>' },
  'hero.motto': { en: '"Nkam si lah" — Unity is Strength', fr: '"Nkam si lah" — L\'Union fait la Force' },
  'hero.desc': {
    en: 'The Baham Bamiléké people of Cameroon\'s Western Highlands carry a legacy of art, royalty, and community. Here in Dallas, Texas, we honor our ancestors while building a vibrant future together.',
    fr: 'Le peuple Baham Bamiléké des Hauts Plateaux de l\'Ouest du Cameroun porte un héritage d\'art, de royauté et de communauté. Ici à Dallas, Texas, nous honorons nos ancêtres tout en construisant ensemble un avenir vibrant.',
  },
  'hero.btn.member': { en: 'Become a Member', fr: 'Devenir Membre' },
  'hero.btn.explore': { en: 'Explore Our Culture', fr: 'Explorer Notre Culture' },

  // Heritage
  'heritage.label': { en: 'Our Heritage', fr: 'Notre Patrimoine' },
  'heritage.title': { en: 'From the Highlands<br>of Cameroon to<br>the Heart of <i>Dallas</i>', fr: 'Des Hauts Plateaux<br>du Cameroun au<br>Cœur de <i>Dallas</i>' },
  'heritage.desc': {
    en: 'The Baham people are one of the proud chieftaincies of the Bamiléké nation in Cameroon\'s West Region. Known for our sophisticated art, hierarchical governance under the Fon (chief), and vibrant cultural expressions, we have carried these traditions across oceans to build community in Dallas, Texas.',
    fr: 'Le peuple Baham est l\'une des fières chefferies de la nation Bamiléké dans la Région de l\'Ouest du Cameroun. Reconnus pour notre art sophistiqué, notre gouvernance hiérarchique sous le Fon (chef) et nos expressions culturelles vibrantes, nous avons porté ces traditions à travers les océans pour bâtir une communauté à Dallas, Texas.',
  },

  // Heritage value cards
  'heritage.value1.title': { en: 'Royal Tradition', fr: 'Tradition Royale' },
  'heritage.value1.desc': {
    en: 'Honoring the Fon and our ancestral governance — a legacy of wisdom and leadership.',
    fr: 'Honorer le Fon et notre gouvernance ancestrale — un héritage de sagesse et de leadership.',
  },
  'heritage.value2.title': { en: 'Unity (Nkam)', fr: 'Unité (Nkam)' },
  'heritage.value2.desc': {
    en: 'Coming together as one family across borders, supporting each other in the diaspora.',
    fr: 'Nous rassembler comme une seule famille au-delà des frontières, nous soutenant dans la diaspora.',
  },
  'heritage.value3.title': { en: 'Cultural Preservation', fr: 'Préservation Culturelle' },
  'heritage.value3.desc': {
    en: 'Keeping our language, dance, music, and art alive for the next generation.',
    fr: 'Faire vivre notre langue, nos danses, notre musique et notre art pour la prochaine génération.',
  },
  'heritage.value4.title': { en: 'Community Impact', fr: 'Impact Communautaire' },
  'heritage.value4.desc': {
    en: 'Building bridges between our Cameroon roots and our American home.',
    fr: 'Bâtir des ponts entre nos racines camerounaises et notre foyer américain.',
  },

  // Baham Location
  'location.label': { en: 'Our Homeland', fr: 'Notre Patrie' },
  'location.title': { en: 'Baham — Heart of the<br>Cameroon Grassfields', fr: 'Baham — Cœur des<br>Grassfields du Cameroun' },
  'location.desc': {
    en: 'Nestled in the Western Highlands at an elevation of 1,400m, the Kingdom of Baham is a historic chieftaincy in Cameroon\'s West Region — renowned for its royal traditions, sacred forests, and artistic heritage.',
    fr: 'Niché dans les Hauts Plateaux de l\'Ouest à 1 400m d\'altitude, le Royaume de Baham est une chefferie historique de la Région de l\'Ouest du Cameroun — renommée pour ses traditions royales, ses forêts sacrées et son patrimoine artistique.',
  },

  // Culture
  'culture.label': { en: 'Our Living Culture', fr: 'Notre Culture Vivante' },
  'culture.title': { en: 'Sacred Arts &<br><i>Traditions</i>', fr: 'Arts Sacrés &<br><i>Traditions</i>' },
  'culture.desc': {
    en: 'Each artifact, dance, and ceremony carries the soul of our people — a bridge between the visible and spiritual worlds.',
    fr: 'Chaque artefact, danse et cérémonie porte l\'âme de notre peuple — un pont entre les mondes visible et spirituel.',
  },

  // Events
  'events.label': { en: 'Upcoming Events', fr: 'Événements à Venir' },
  'events.title': { en: 'Gathering Our<br><i>Community</i>', fr: 'Rassembler Notre<br><i>Communauté</i>' },
  'events.btn': { en: 'View All Events →', fr: 'Voir Tous les Événements →' },

  // Gallery
  'gallery.label': { en: 'Photo Gallery', fr: 'Galerie Photo' },
  'gallery.title': { en: 'Moments of<br><i>Pride & Joy</i>', fr: 'Moments de<br><i>Fierté & Joie</i>' },

  // Leadership
  'leadership.label': { en: 'Community Leadership', fr: 'Direction Communautaire' },
  'leadership.title': { en: 'Our Pillars of<br><i>Strength</i>', fr: 'Nos Piliers de<br><i>Force</i>' },
  'leadership.desc': {
    en: 'Guided by tradition and committed to service, our leaders bridge our homeland and our Dallas community.',
    fr: 'Guidés par la tradition et engagés au service, nos dirigeants font le pont entre notre patrie et notre communauté de Dallas.',
  },

  // Join
  'join.label': { en: 'Join Our Family', fr: 'Rejoignez Notre Famille' },
  'join.title': { en: 'Be Part of<br>Something <i>Greater</i>', fr: 'Faites Partie de<br>Quelque Chose de <i>Grand</i>' },
  'join.desc': {
    en: 'Whether you are Baham, Bamiléké, Cameroonian, or a friend of our culture — you are welcome. Together we preserve our heritage and uplift our community in the Dallas–Fort Worth metroplex.',
    fr: 'Que vous soyez Baham, Bamiléké, Camerounais ou ami de notre culture — vous êtes les bienvenus. Ensemble, nous préservons notre patrimoine et élevons notre communauté dans la métropole de Dallas–Fort Worth.',
  },
  'join.btn': { en: 'Join Now', fr: 'Rejoindre' },
  'join.whatsapp': { en: 'Chat on WhatsApp', fr: 'Discuter sur WhatsApp' },
  'join.stickyCta': { en: 'Join the Community', fr: 'Rejoindre la Communauté' },

  // Auth pages
  'auth.signin': { en: 'Sign In', fr: 'Connexion' },
  'auth.signup': { en: 'Create Account', fr: 'Créer un Compte' },
  'auth.signout': { en: 'Sign Out', fr: 'Déconnexion' },
  'auth.dashboard': { en: 'Dashboard', fr: 'Tableau de Bord' },
  'auth.forgot': { en: 'Forgot Password?', fr: 'Mot de passe oublié ?' },
  'auth.email': { en: 'Email', fr: 'E-mail' },
  'auth.password': { en: 'Password', fr: 'Mot de passe' },
  'auth.name': { en: 'Full Name', fr: 'Nom Complet' },
  'auth.phone': { en: 'Phone (optional)', fr: 'Téléphone (optionnel)' },
  'auth.hometown': { en: 'Hometown (optional)', fr: 'Ville d\'origine (optionnel)' },
  'auth.noAccount': { en: 'Don\'t have an account?', fr: 'Pas de compte ?' },
  'auth.hasAccount': { en: 'Already have an account?', fr: 'Déjà un compte ?' },

  // Finances (member-facing)
  'finances.dues': { en: 'Dues', fr: 'Cotisations' },
  'finances.duesPaid': { en: 'Dues Paid', fr: 'Cotisations Payées' },
  'finances.totalContributed': { en: 'Total Contributed', fr: 'Total Cotisé' },
  'finances.myContributions': { en: 'My Contributions', fr: 'Mes Cotisations' },
  'finances.standing': { en: 'Standing', fr: 'Situation' },
  'finances.standingLabel': { en: 'Financial Standing', fr: 'Situation Financière' },
  'finances.amount': { en: 'Amount', fr: 'Montant' },
  'finances.date': { en: 'Date', fr: 'Date' },
  'finances.method': { en: 'Method', fr: 'Mode' },
  'finances.description': { en: 'Description', fr: 'Description' },
  'finances.noContributions': { en: 'No contributions recorded yet.', fr: 'Aucune cotisation enregistrée.' },
  'finances.viewAll': { en: 'View All', fr: 'Voir Tout' },
  'finances.standing.GOOD_STANDING': { en: 'Good Standing', fr: 'En règle' },
  'finances.standing.BEHIND': { en: 'Behind', fr: 'À régulariser' },
  'finances.standing.NEW': { en: 'New Member', fr: 'Nouveau membre' },
  'finances.standing.EXEMPT': { en: 'Exempt', fr: 'Dispensé' },

  // Meeting Notes
  'meetings.title': { en: 'Meeting Notes', fr: 'Comptes Rendus' },
  'meetings.recentTitle': { en: 'Recent Meeting Notes', fr: 'Comptes Rendus Récents' },
  'meetings.viewAll': { en: 'View All', fr: 'Voir Tout' },
  'meetings.noNotes': { en: 'No meeting notes yet.', fr: 'Aucun compte rendu pour le moment.' },
  'meetings.date': { en: 'Date', fr: 'Date' },
  'meetings.author': { en: 'Author', fr: 'Auteur' },
  'meetings.readMore': { en: 'Read More', fr: 'Lire la Suite' },
  'meetings.backToList': { en: 'Back to Meeting Notes', fr: 'Retour aux Comptes Rendus' },
  'meetings.fallback.enOnly': {
    en: 'French translation not available — English version shown below.',
    fr: 'Traduction française non disponible — version anglaise ci-dessous.',
  },
  'meetings.fallback.frOnly': {
    en: 'English translation not available — French version shown below.',
    fr: 'Traduction anglaise non disponible — version française ci-dessous.',
  },
  'meetings.contentUnavailable': { en: 'Content unavailable.', fr: 'Contenu non disponible.' },

  // Events (member-facing)
  'eventsPage.title': { en: 'Events', fr: 'Événements' },
  'eventsPage.upcoming': { en: 'Upcoming Events', fr: 'Événements à Venir' },
  'eventsPage.past': { en: 'Past Events', fr: 'Événements Passés' },
  'eventsPage.viewPast': { en: 'View past events', fr: 'Voir les événements passés' },
  'eventsPage.hidePast': { en: 'Hide past events', fr: 'Masquer les événements passés' },
  'eventsPage.viewAll': { en: 'View All', fr: 'Voir Tout' },
  'eventsPage.noUpcoming': { en: 'No upcoming events.', fr: 'Aucun événement à venir.' },
  'eventsPage.noPast': { en: 'No past events.', fr: 'Aucun événement passé.' },
  'eventsPage.rsvp.going': { en: 'Going', fr: 'J\'y serai' },
  'eventsPage.rsvp.maybe': { en: 'Maybe', fr: 'Peut-être' },
  'eventsPage.rsvp.notGoing': { en: 'Not Going', fr: 'Absent' },
  'eventsPage.full': { en: 'Event Full', fr: 'Complet' },
  'eventsPage.spotsGoing': { en: 'going', fr: 'présents' },
  'eventsPage.capacityOf': { en: 'of', fr: 'sur' },
  'eventsPage.whoGoing': { en: 'Going', fr: 'Présents' },
  'eventsPage.whoMaybe': { en: 'Maybe', fr: 'Peut-être' },
  'eventsPage.whoNotGoing': { en: 'Not Going', fr: 'Absents' },
  'eventsPage.noResponses': { en: 'No responses yet.', fr: 'Aucune réponse pour le moment.' },
  'eventsPage.seeWho': { en: 'See who\'s coming', fr: 'Voir qui vient' },
  'eventsPage.hideWho': { en: 'Hide attendees', fr: 'Masquer les participants' },
  'eventsPage.rsvpFailed': { en: 'Failed to update RSVP', fr: 'Échec de la mise à jour de la réponse' },
  'common.networkError': { en: 'Network error', fr: 'Erreur réseau' },

  // Member dashboard chrome
  'dash.welcome': { en: 'Welcome back,', fr: 'Bon retour,' },
  'dash.motto': { en: '"Nkam si lah" — Unity is Strength', fr: '"Nkam si lah" — L\'Union fait la Force' },
  'dash.memberPortal': { en: 'Member Portal', fr: 'Espace Membre' },
  'dash.switchAdmin': { en: 'Switch to Admin Portal', fr: 'Passer au Portail Admin' },
  'dash.home': { en: 'Home', fr: 'Accueil' },
  'dash.admin': { en: 'Admin', fr: 'Admin' },
  'dash.notifications': { en: 'Notifications', fr: 'Notifications' },
  'dash.settings': { en: 'Settings', fr: 'Paramètres' },
  'dash.statMembers': { en: 'Active Members', fr: 'Membres Actifs' },
  'dash.statAttended': { en: 'Events Attended', fr: 'Événements Suivis' },
  'dash.quickActions': { en: 'Quick Actions', fr: 'Actions Rapides' },
  'dash.qa.viewContributions': { en: 'View My Contributions', fr: 'Voir Mes Cotisations' },
  'dash.qa.rsvp': { en: 'RSVP to Events', fr: 'Répondre aux Événements' },
  'dash.qa.contact': { en: 'Contact Leadership', fr: 'Contacter la Direction' },
  'dash.contributed': { en: '${amount} contributed', fr: '{amount} $ cotisés' },

  // Community activity feed
  'activity.title': { en: 'Community Activity', fr: 'Activité de la Communauté' },
  'activity.empty': { en: 'No recent activity.', fr: 'Aucune activité récente.' },
  'activity.viewMore': { en: 'View more', fr: 'Voir plus' },
  'activity.viewLess': { en: 'View less', fr: 'Voir moins' },
  'activity.you': { en: 'You', fr: 'Vous' },
  'activity.community': { en: 'Community', fr: 'Communauté' },
  'activity.meetingNote': { en: 'New meeting note: {title}', fr: 'Nouveau compte-rendu : {title}' },
  'activity.eventCreated': { en: 'New event: {title} ({date})', fr: 'Nouvel événement : {title} ({date})' },
  'activity.eventFilling': { en: '{title} is filling up — {n} spots left', fr: '{title} se remplit — {n} places restantes' },
  'activity.rsvp': { en: 'You RSVPed “{response}” to {title}', fr: 'Vous avez répondu « {response} » à {title}' },
  'activity.contribution': { en: '${amount} recorded toward your contributions ({date})', fr: '{amount} $ enregistré pour vos cotisations ({date})' },
  'activity.newMember': { en: 'Welcome to {name}!', fr: 'Bienvenue à {name} !' },
  'activity.spotsLeft': { en: '{n} spots left', fr: '{n} places restantes' },
  'activity.spotLeft': { en: '{n} spot left', fr: '{n} place restante' },

  // Relative time
  'time.now': { en: 'just now', fr: 'à l\'instant' },

  // Admin chrome
  'admin.controlPanel': { en: 'Control Panel', fr: 'Panneau de Contrôle' },
  'admin.switchToMember': { en: 'Switch to Member Portal', fr: 'Passer à l\'Espace Membre' },
  'admin.portal': { en: 'Portal', fr: 'Portail' },
  'admin.members': { en: 'Members', fr: 'Membres' },
  'admin.permissions': { en: 'Permissions', fr: 'Permissions' },
  'admin.finances': { en: 'Finances', fr: 'Finances' },
  'admin.meetings': { en: 'Meetings', fr: 'Réunions' },
  'admin.events': { en: 'Events', fr: 'Événements' },
  'admin.reports': { en: 'Reports', fr: 'Rapports' },
  'admin.messages': { en: 'Messages', fr: 'Messages' },
  'admin.signOut': { en: 'Sign Out', fr: 'Déconnexion' },
  'admin.more': { en: 'More', fr: 'Plus' },
  'admin.gallery': { en: 'Gallery', fr: 'Galerie' },
  'admin.culture': { en: 'Culture', fr: 'Culture' },

  // Admin reports
  'reports.title': { en: 'Reports', fr: 'Rapports' },
  'reports.subtitle': { en: 'Community health at a glance', fr: 'La santé de la communauté en un coup d\'œil' },
  'reports.period.ytd': { en: 'YTD', fr: 'Année' },
  'reports.period.12mo': { en: '12 mo', fr: '12 mois' },
  'reports.period.all': { en: 'All time', fr: 'Tout' },
  'reports.exportCsv': { en: 'Export CSV', fr: 'Exporter CSV' },
  'reports.stat.activeMembers': { en: 'Active Members', fr: 'Membres Actifs' },
  'reports.stat.duesCollected': { en: 'Dues Collected', fr: 'Cotisations Perçues' },
  'reports.stat.avgAttendance': { en: 'Avg. Event Attendance', fr: 'Présence Moy. aux Événements' },
  'reports.stat.behindOnDues': { en: 'Behind on Dues', fr: 'En Retard de Cotisation' },
  'reports.chart.membership': { en: 'Membership Growth', fr: 'Croissance des Membres' },
  'reports.chart.contributions': { en: 'Contributions / Month', fr: 'Cotisations / Mois' },
  'reports.table.title': { en: 'Event Attendance', fr: 'Présence aux Événements' },
  'reports.table.event': { en: 'Event', fr: 'Événement' },
  'reports.table.date': { en: 'Date', fr: 'Date' },
  'reports.table.rsvpd': { en: 'RSVP’d', fr: 'Inscrits' },
  'reports.table.attended': { en: 'Attended', fr: 'Présents' },
  'reports.table.turnout': { en: 'Turnout', fr: 'Taux' },
  'reports.noEvents': { en: 'No events in this period.', fr: 'Aucun événement sur cette période.' },
  'reports.loading': { en: 'Loading reports…', fr: 'Chargement des rapports…' },

  // Admin messages
  'messages.title': { en: 'Messages', fr: 'Messages' },
  'messages.subtitle': { en: 'Messages sent through the website', fr: 'Messages envoyés depuis le site' },
  'messages.filter.all': { en: 'All', fr: 'Tous' },
  'messages.filter.unread': { en: 'Unread', fr: 'Non lus' },
  'messages.filter.join': { en: 'Join requests', fr: 'Demandes d\'adhésion' },
  'messages.joinRequest': { en: 'Website message', fr: 'Message du site' },
  'messages.empty': { en: 'No messages.', fr: 'Aucun message.' },
  'messages.selectPrompt': { en: 'Select a message to read.', fr: 'Sélectionnez un message à lire.' },
  'messages.loading': { en: 'Loading messages…', fr: 'Chargement des messages…' },
  'messages.email': { en: 'Email', fr: 'E-mail' },
  'messages.phone': { en: 'Phone', fr: 'Téléphone' },
  'messages.hometown': { en: 'Hometown', fr: 'Ville d\'origine' },
  'messages.noMessage': { en: 'No message provided.', fr: 'Aucun message fourni.' },
  'messages.callout': {
    en: 'Approve & Invite emails this person a link to create their member account, with their address filled in. Their account still needs email confirmation and your approval on the Members page.',
    fr: "Approuver & Inviter envoie à cette personne un lien pour créer son compte membre, avec son adresse déjà remplie. Son compte devra encore être confirmé par e-mail puis approuvé dans la page Membres.",
  },
  'messages.inviteSent': { en: 'Invitation sent.', fr: 'Invitation envoyée.' },
  'messages.inviteFailed': { en: 'Marked as approved, but the invitation email could not be sent. Reply by email instead.', fr: "Marquée comme approuvée, mais l'invitation n'a pas pu être envoyée. Répondez plutôt par e-mail." },
  'messages.actionFailed': { en: "That didn't work. Please try again.", fr: "Cela n'a pas fonctionné. Veuillez réessayer." },
  'messages.approve': { en: 'Approve & Invite', fr: 'Approuver & Inviter' },
  'messages.decline': { en: 'Decline', fr: 'Refuser' },
  'messages.replyByEmail': { en: 'Reply by Email', fr: 'Répondre par E-mail' },
  'messages.status.PENDING': { en: 'Pending', fr: 'En attente' },
  'messages.status.APPROVED': { en: 'Approved', fr: 'Approuvé' },
  'messages.status.REJECTED': { en: 'Declined', fr: 'Refusé' },

  // Form validation
  'form.emailEmpty': { en: 'Please enter your email address.', fr: 'Veuillez entrer votre adresse e-mail.' },
  'form.emailInvalid': { en: 'Please enter a valid email address.', fr: 'Veuillez entrer une adresse e-mail valide.' },
  'form.success': { en: 'Thank you! We\'ll be in touch soon.', fr: 'Merci ! Nous vous contacterons bientôt.' },

  // Brand
  'brand.name': { en: "La'Hom DFW", fr: "La'Hom DFW" },
  'brand.tagline': { en: 'Baham Bamiléké Community of Dallas–Fort Worth', fr: 'Communauté Baham Bamiléké de Dallas–Fort Worth' },
  'brand.place': { en: 'Dallas–Fort Worth', fr: 'Dallas–Fort Worth' },

  // Hero extras
  'hero.scroll': { en: 'Scroll', fr: 'Défiler' },
  'hero.imageAlt': { en: 'Enthronement ceremony of a Mafo in Baham, Cameroon', fr: "Cérémonie d'intronisation d'une Mafo à Baham, Cameroun" },

  // Culture ticker
  'ticker.1': { en: 'Elephant Mask Dance', fr: 'Danse du masque éléphant' },
  'ticker.2': { en: 'Ndop Royal Cloth', fr: 'Tissu royal ndop' },
  'ticker.3': { en: 'Juju Feathered Hats', fr: 'Coiffes à plumes juju' },
  'ticker.4': { en: 'Beaded Thrones', fr: 'Trônes perlés' },
  'ticker.5': { en: 'Royal Chieftaincy', fr: 'Chefferie royale' },
  'ticker.6': { en: 'Toghu Royal Garment', fr: 'Toghu, habit royal' },
  'ticker.7': { en: 'Nkam Festival', fr: 'Festival Nkam' },
  'ticker.8': { en: "Ghomala' Language", fr: "Langue ghomala'" },
  'ticker.9': { en: 'Sacred Forests', fr: 'Forêts sacrées' },

  // Heritage photos
  'heritage.photo1.tag': { en: 'Royal Museum of Baham', fr: 'Musée royal de Baham' },
  'heritage.photo1.alt': { en: 'Royal Museum of Baham, traditional Grassfields architecture', fr: 'Musée royal de Baham, architecture traditionnelle des Grassfields' },
  'heritage.photo2.tag': { en: 'Sacred Artifacts', fr: 'Objets sacrés' },
  'heritage.photo2.alt': { en: 'Interior of the Royal Museum with ancestral sculptures', fr: 'Intérieur du Musée royal et sculptures ancestrales' },

  // Location facts
  'location.mapLabel': { en: 'Map of Cameroon showing where Baham is', fr: 'Carte du Cameroun indiquant Baham' },
  'location.region': { en: 'West Region', fr: "Région de l'Ouest" },
  'location.fact.region': { en: 'Region', fr: 'Région' },
  'location.fact.regionValue': { en: 'West · Hauts-Plateaux', fr: 'Ouest · Hauts-Plateaux' },
  'location.fact.language': { en: 'Language', fr: 'Langue' },
  'location.fact.altitude': { en: 'Altitude', fr: 'Altitude' },
  'location.fact.coordinates': { en: 'Coordinates', fr: 'Coordonnées' },

  // Elephant mask feature
  'mask.label': { en: 'The Elephant Mask', fr: 'Le masque éléphant' },
  'mask.p1': {
    en: "The elephant mask is the most iconic symbol of Bamiléké artistic achievement. With protruding circular ears, geometric beadwork and rows of triangles, the sacred symbol of the leopard, it represents the Fon's power to transform into nature's mightiest creatures.",
    fr: "Le masque éléphant est le symbole le plus emblématique de l'art bamiléké. Avec ses oreilles circulaires, son perlage géométrique et ses rangées de triangles, symbole sacré du léopard, il représente le pouvoir du Fon de se transformer en la plus puissante des créatures.",
  },
  'mask.p2': {
    en: 'A mask like this one is held by the Dallas Museum of Art, a living bridge between our ancestral homeland and our Texas community.',
    fr: "Un masque comme celui-ci est conservé au Dallas Museum of Art, un pont vivant entre notre terre ancestrale et notre communauté du Texas.",
  },
  'mask.alt': { en: 'Close-up of Bamiléké elephant mask beadwork', fr: "Gros plan sur le perlage d'un masque éléphant bamiléké" },
  'mask.leopard': { en: 'Leopard', fr: 'Léopard' },
  'mask.power': { en: 'Power', fr: 'Puissance' },
  'mask.elephant': { en: 'Elephant', fr: 'Éléphant' },
  'mask.wisdom': { en: 'Wisdom', fr: 'Sagesse' },
  'mask.royal': { en: 'Royalty', fr: 'Royauté' },
  'mask.authority': { en: 'Authority', fr: 'Autorité' },

  // Events (landing)
  'events.emptyTitle': { en: 'No gathering is scheduled right now', fr: "Aucun rassemblement n'est prévu pour le moment" },
  'events.emptyBody': {
    en: 'Members receive invitations in the member portal and on WhatsApp. Create your member account to be invited to the next one.',
    fr: "Les membres reçoivent les invitations dans l'espace membre et sur WhatsApp. Créez votre compte membre pour être invité(e) au prochain.",
  },
  'events.emptyCta': { en: 'Become a member', fr: 'Devenir membre' },
  'events.memberLink': { en: 'All events in the member portal →', fr: "Tous les événements dans l'espace membre →" },

  // Leadership roles
  'leadership.role.president': { en: 'Community President', fr: 'Président de la communauté' },
  'leadership.role.vp': { en: 'Vice President', fr: 'Vice-président' },
  'leadership.role.secretary': { en: 'Secretary General', fr: 'Secrétaire général' },
  'leadership.role.treasurer': { en: 'Treasurer', fr: 'Trésorier' },
  'leadership.honorific': { en: 'Mr.', fr: 'M.' },

  // Join + contact
  'join.cta': { en: 'Create your member account', fr: 'Créer votre compte membre' },
  'join.stepsTitle': { en: 'How membership works', fr: 'Comment devenir membre' },
  'join.step1': { en: 'Create your account with your name and email.', fr: 'Créez votre compte avec votre nom et votre e-mail.' },
  'join.step2': { en: 'Confirm your email with the link we send you.', fr: 'Confirmez votre e-mail grâce au lien que nous vous envoyons.' },
  'join.step3': { en: 'An officer reviews and approves your membership.', fr: 'Un responsable examine et approuve votre adhésion.' },
  'join.haveAccount': { en: 'Already a member?', fr: 'Déjà membre ?' },
  'contact.title': { en: 'Questions? Write to us', fr: 'Une question ? Écrivez-nous' },
  'contact.name': { en: 'Your name', fr: 'Votre nom' },
  'contact.email': { en: 'Your email', fr: 'Votre e-mail' },
  'contact.message': { en: 'Your message', fr: 'Votre message' },
  'contact.send': { en: 'Send message', fr: 'Envoyer le message' },
  'contact.sending': { en: 'Sending…', fr: 'Envoi…' },
  'contact.sent': { en: 'Thank you. An officer will reply by email.', fr: 'Merci. Un responsable vous répondra par e-mail.' },
  'contact.error': { en: 'Your message could not be sent. Please try again, or email info@lahomdfw.org.', fr: "Votre message n'a pas pu être envoyé. Réessayez, ou écrivez à info@lahomdfw.org." },
  'contact.nameRequired': { en: 'Please enter your name.', fr: 'Veuillez entrer votre nom.' },
  'contact.messageRequired': { en: 'Please write a short message.', fr: 'Veuillez écrire un court message.' },
  'contact.orEmail': { en: 'Or email', fr: 'Ou écrivez à' },

  // Footer
  'footer.about': {
    en: "La'Hom DFW brings the Baham Bamiléké community of Dallas–Fort Worth together to preserve and teach the language, history, arts and traditions of the Baham people, and to support education and the integration of immigrants in our area.",
    fr: "La'Hom DFW rassemble la communauté Baham Bamiléké de Dallas–Fort Worth pour préserver et transmettre la langue, l'histoire, les arts et les traditions du peuple Baham, et pour soutenir l'éducation et l'intégration des immigrants de notre région.",
  },
  'footer.flag': { en: 'Republic of Cameroon', fr: 'République du Cameroun' },
  'footer.quickLinks': { en: 'Explore', fr: 'Découvrir' },
  'footer.culture': { en: 'Culture & Art', fr: 'Culture et art' },
  'footer.members': { en: 'Members', fr: 'Membres' },
  'footer.becomeMember': { en: 'Become a member', fr: 'Devenir membre' },
  'footer.signIn': { en: 'Member sign-in', fr: 'Espace membre' },
  'footer.contact': { en: 'Contact', fr: 'Contact' },
  'footer.whatsapp': { en: 'WhatsApp group', fr: 'Groupe WhatsApp' },
  'footer.rights': { en: "© {year} La'Hom DFW. All rights reserved.", fr: "© {year} La'Hom DFW. Tous droits réservés." },
  'footer.photos': { en: 'Heritage photos from Wikimedia Commons (CC BY-SA) by', fr: 'Photos du patrimoine issues de Wikimedia Commons (CC BY-SA), par' },

  // Auth shell
  'auth.home': { en: 'Home', fr: 'Accueil' },
  'auth.tagline': { en: 'Connecting our community, preserving our heritage, building our future together.', fr: 'Relier notre communauté, préserver notre patrimoine, bâtir ensemble notre avenir.' },
  'auth.showPassword': { en: 'Show password', fr: 'Afficher le mot de passe' },
  'auth.hidePassword': { en: 'Hide password', fr: 'Masquer le mot de passe' },
  'auth.backToSignin': { en: 'Back to sign in', fr: 'Retour à la connexion' },
  'auth.loading': { en: 'Loading…', fr: 'Chargement…' },

  // Sign in
  'signin.title': { en: 'Welcome back', fr: 'Bon retour' },
  'signin.subtitle': { en: "Sign in to your La'Hom DFW member account", fr: "Connectez-vous à votre compte membre La'Hom DFW" },
  'signin.verified': { en: 'Email confirmed. You can sign in now.', fr: 'E-mail confirmé. Vous pouvez vous connecter.' },
  'signin.invalid': { en: "That email and password don't match. Check both and try again.", fr: 'Cet e-mail et ce mot de passe ne correspondent pas. Vérifiez-les et réessayez.' },
  'signin.locked': { en: 'Too many attempts. Sign-in is paused for 15 minutes; try again later or reset your password.', fr: 'Trop de tentatives. La connexion est suspendue pendant 15 minutes ; réessayez plus tard ou réinitialisez votre mot de passe.' },
  'signin.failed': { en: 'Sign-in failed. Please try again.', fr: 'La connexion a échoué. Veuillez réessayer.' },
  'signin.submit': { en: 'Sign in', fr: 'Se connecter' },
  'signin.submitting': { en: 'Signing in…', fr: 'Connexion…' },
  'signin.forgot': { en: 'Forgot your password?', fr: 'Mot de passe oublié ?' },
  'signin.noAccount': { en: 'Not a member yet?', fr: 'Pas encore membre ?' },
  'signin.create': { en: 'Create an account', fr: 'Créer un compte' },

  // Sign up
  'signup.title': { en: "Join La'Hom DFW", fr: "Rejoindre La'Hom DFW" },
  'signup.subtitle': { en: 'Create your member account. After you confirm your email, an officer reviews and approves it.', fr: "Créez votre compte membre. Après la confirmation de votre e-mail, un responsable l'examine et l'approuve." },
  'signup.account': { en: 'Your account', fr: 'Votre compte' },
  'signup.optional': { en: 'Optional', fr: 'Facultatif' },
  'signup.name': { en: 'Full name', fr: 'Nom complet' },
  'signup.namePlaceholder': { en: 'As members know you', fr: 'Tel que les membres vous connaissent' },
  'signup.confirm': { en: 'Confirm password', fr: 'Confirmer le mot de passe' },
  'signup.rulesTitle': { en: 'Your password needs', fr: 'Votre mot de passe doit contenir' },
  'signup.rule.length': { en: 'At least 8 characters', fr: 'Au moins 8 caractères' },
  'signup.rule.lower': { en: 'A lowercase letter', fr: 'Une minuscule' },
  'signup.rule.upper': { en: 'An uppercase letter', fr: 'Une majuscule' },
  'signup.rule.number': { en: 'A number', fr: 'Un chiffre' },
  'signup.rule.symbol': { en: 'A symbol, such as ! # - or _', fr: 'Un symbole, comme ! # - ou _' },
  'signup.mismatch': { en: "The two passwords don't match.", fr: 'Les deux mots de passe ne correspondent pas.' },
  'signup.weak': { en: 'Your password needs every item in the list above.', fr: 'Votre mot de passe doit remplir toutes les conditions ci-dessus.' },
  'signup.phone': { en: 'Phone', fr: 'Téléphone' },
  'signup.hometown': { en: 'Hometown', fr: "Ville d'origine" },
  'signup.submit': { en: 'Create my account', fr: 'Créer mon compte' },
  'signup.submitting': { en: 'Creating your account…', fr: 'Création du compte…' },
  'signup.hasAccount': { en: 'Already a member?', fr: 'Déjà membre ?' },
  'signup.exists': { en: 'An account already uses this email. Sign in, or reset your password if you forgot it.', fr: "Un compte utilise déjà cet e-mail. Connectez-vous, ou réinitialisez votre mot de passe si vous l'avez oublié." },
  'signup.failed': { en: "We couldn't create your account. Please try again.", fr: "Nous n'avons pas pu créer votre compte. Veuillez réessayer." },

  // Verify email (waiting page)
  'verifyReq.title': { en: 'Check your email', fr: 'Vérifiez votre boîte mail' },
  'verifyReq.bodyTo': { en: 'We sent a confirmation link to {email}. Open it to confirm your address; it works for 24 hours.', fr: 'Nous avons envoyé un lien de confirmation à {email}. Ouvrez-le pour confirmer votre adresse ; il est valable 24 heures.' },
  'verifyReq.body': { en: 'We sent a confirmation link to your email address. Open it to confirm your address; it works for 24 hours.', fr: 'Nous avons envoyé un lien de confirmation à votre adresse e-mail. Ouvrez-le pour confirmer votre adresse ; il est valable 24 heures.' },
  'verifyReq.createdNotSent': { en: "Your account was created, but we couldn't send the confirmation email to {email}. Use the button below to try again, or write to info@lahomdfw.org.", fr: "Votre compte a été créé, mais nous n'avons pas pu envoyer l'e-mail de confirmation à {email}. Utilisez le bouton ci-dessous pour réessayer, ou écrivez à info@lahomdfw.org." },
  'verifyReq.notSent': { en: "We couldn't send the email just now. Use the button below to try again, or write to info@lahomdfw.org.", fr: "Nous n'avons pas pu envoyer l'e-mail pour le moment. Utilisez le bouton ci-dessous pour réessayer, ou écrivez à info@lahomdfw.org." },
  'verifyReq.next': { en: "Then an officer reviews your registration. You'll get an email when it's approved.", fr: 'Ensuite, un responsable examine votre inscription. Vous recevrez un e-mail une fois approuvée.' },
  'verifyReq.resendLabel': { en: "Didn't get it? Check your spam folder, or send a new link:", fr: 'Rien reçu ? Vérifiez vos courriers indésirables, ou envoyez un nouveau lien :' },
  'verifyReq.resend': { en: 'Send a new link', fr: 'Envoyer un nouveau lien' },
  'verifyReq.sending': { en: 'Sending…', fr: 'Envoi…' },
  'verifyReq.sent': { en: 'If that address has an unconfirmed account, a new link is on its way.', fr: 'Si cette adresse a un compte non confirmé, un nouveau lien est en route.' },
  'verifyReq.error': { en: "We couldn't send the email right now. Please try again later.", fr: "Nous n'avons pas pu envoyer l'e-mail pour le moment. Veuillez réessayer plus tard." },

  // Verify email (link result)
  'verify.title': { en: 'Email confirmation', fr: "Confirmation de l'e-mail" },
  'verify.checking': { en: 'Confirming your email…', fr: 'Confirmation de votre e-mail…' },
  'verify.expired': { en: 'This link has expired. Links work for 24 hours; send yourself a new one below.', fr: 'Ce lien a expiré. Les liens sont valables 24 heures ; envoyez-vous-en un nouveau ci-dessous.' },
  'verify.invalid': { en: "This link isn't valid or was already used. If you already confirmed your email, just sign in.", fr: "Ce lien n'est pas valide ou a déjà été utilisé. Si vous avez déjà confirmé votre e-mail, connectez-vous simplement." },
  'verify.failed': { en: 'Something went wrong while confirming your email. Please try again.', fr: 'Un problème est survenu lors de la confirmation de votre e-mail. Veuillez réessayer.' },
  'verify.default': { en: 'Check your email for a confirmation link.', fr: 'Vérifiez votre boîte mail : un lien de confirmation vous attend.' },

  // Pending approval
  'pending.title': { en: 'Awaiting approval', fr: "En attente d'approbation" },
  'pending.body': { en: "Your email is confirmed. An officer will review your registration, and you'll get an email when it's approved. This page updates by itself.", fr: 'Votre e-mail est confirmé. Un responsable examinera votre inscription et vous recevrez un e-mail une fois approuvée. Cette page se met à jour toute seule.' },
  'pending.rejectedTitle': { en: 'Registration not approved', fr: 'Inscription non approuvée' },
  'pending.rejectedBody': { en: 'Our officers were not able to approve this registration. If you think this is a mistake, write to info@lahomdfw.org.', fr: "Nos responsables n'ont pas pu approuver cette inscription. Si vous pensez qu'il s'agit d'une erreur, écrivez à info@lahomdfw.org." },
  'pending.whatsapp': { en: 'Join the WhatsApp community', fr: 'Rejoindre la communauté WhatsApp' },

  // Forgot / reset password
  'forgot.title': { en: 'Reset your password', fr: 'Réinitialiser votre mot de passe' },
  'forgot.body': { en: "Enter the email you signed up with and we'll send you a reset link.", fr: "Entrez l'e-mail utilisé lors de votre inscription et nous vous enverrons un lien de réinitialisation." },
  'forgot.submit': { en: 'Send reset link', fr: 'Envoyer le lien' },
  'forgot.sending': { en: 'Sending…', fr: 'Envoi…' },
  'forgot.sent': { en: 'If an account exists for that email, a reset link is on its way. It works for 1 hour.', fr: 'Si un compte existe pour cet e-mail, un lien de réinitialisation est en route. Il est valable 1 heure.' },
  'forgot.error': { en: "We couldn't send the link right now. Please try again.", fr: "Nous n'avons pas pu envoyer le lien pour le moment. Veuillez réessayer." },
  'reset.title': { en: 'Choose a new password', fr: 'Choisissez un nouveau mot de passe' },
  'reset.new': { en: 'New password', fr: 'Nouveau mot de passe' },
  'reset.submit': { en: 'Save new password', fr: 'Enregistrer le nouveau mot de passe' },
  'reset.saving': { en: 'Saving…', fr: 'Enregistrement…' },
  'reset.done': { en: 'Your password is changed. You can sign in with it now.', fr: 'Votre mot de passe a été modifié. Vous pouvez vous connecter avec.' },
  'reset.invalidLink': { en: 'This reset link is incomplete. Request a new one.', fr: 'Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.' },
  'reset.requestNew': { en: 'Request a new link', fr: 'Demander un nouveau lien' },
  'reset.failed': { en: "We couldn't change your password. Please try again.", fr: "Nous n'avons pas pu modifier votre mot de passe. Veuillez réessayer." },

  // Not found
  'notFound.title': { en: "This page doesn't exist", fr: "Cette page n'existe pas" },
  'notFound.body': { en: 'The link may be old or mistyped.', fr: 'Le lien est peut-être ancien ou mal saisi.' },
  'notFound.home': { en: 'Go to the home page', fr: "Aller à l'accueil" },

  // Portal chrome
  'role.MEMBER': { en: 'Member', fr: 'Membre' },
  'role.SUPER_ADMIN': { en: 'Super Admin', fr: 'Super administrateur' },
  'lang.label': { en: 'Français', fr: 'English' },
}
