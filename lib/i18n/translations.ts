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
    en: 'Or contact us at <strong>info@baham-dallas.org</strong> · (469) 555-BHAM',
    fr: 'Ou contactez-nous à <strong>info@baham-dallas.org</strong> · (469) 555-BHAM',
  },
  'join.whatsapp': { en: 'Chat on WhatsApp', fr: 'Discuter sur WhatsApp' },

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

  // Form validation
  'form.emailEmpty': { en: 'Please enter your email address.', fr: 'Veuillez entrer votre adresse e-mail.' },
  'form.emailInvalid': { en: 'Please enter a valid email address.', fr: 'Veuillez entrer une adresse e-mail valide.' },
  'form.success': { en: 'Thank you! We\'ll be in touch soon.', fr: 'Merci ! Nous vous contacterons bientôt.' },
}
