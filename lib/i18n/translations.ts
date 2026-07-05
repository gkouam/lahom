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
  'join.contact': {
    en: 'Or contact us at <strong>info@lahomdfw.org</strong> · (469) 555-BHAM',
    fr: 'Ou contactez-nous à <strong>info@lahomdfw.org</strong> · (469) 555-BHAM',
  },
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
  'messages.subtitle': { en: 'Membership requests and inquiries', fr: 'Demandes d\'adhésion et messages' },
  'messages.filter.all': { en: 'All', fr: 'Tous' },
  'messages.filter.unread': { en: 'Unread', fr: 'Non lus' },
  'messages.filter.join': { en: 'Join requests', fr: 'Demandes d\'adhésion' },
  'messages.joinRequest': { en: 'Join request', fr: 'Demande d\'adhésion' },
  'messages.empty': { en: 'No messages.', fr: 'Aucun message.' },
  'messages.selectPrompt': { en: 'Select a message to read.', fr: 'Sélectionnez un message à lire.' },
  'messages.loading': { en: 'Loading messages…', fr: 'Chargement des messages…' },
  'messages.email': { en: 'Email', fr: 'E-mail' },
  'messages.phone': { en: 'Phone', fr: 'Téléphone' },
  'messages.hometown': { en: 'Hometown', fr: 'Ville d\'origine' },
  'messages.noMessage': { en: 'No message provided.', fr: 'Aucun message fourni.' },
  'messages.callout': {
    en: 'Approving marks this request as approved so you can invite the person to register at the sign-up page. It does not create an account automatically.',
    fr: 'Approuver marque cette demande comme approuvée afin que vous puissiez inviter la personne à s\'inscrire. Cela ne crée pas de compte automatiquement.',
  },
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
}
