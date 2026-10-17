/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — translations-app.js  (DEUXIÈME TRADUCTION : l'intérieur)
   ══════════════════════════════════════════════════════════════════════
   - translations.js (index + inscriptions) N'EST PAS modifié.
   - Ce fichier se charge JUSTE APRÈS translations.js et ajoute les textes
     de l'intérieur de l'application, dans les 10 langues.
   - La langue est la même partout (choix gardé dans "ar_lang").
   - Dans le code des pages : TR('Texte en français') donne le texte dans
     la langue choisie. Si une traduction manque : le français s'affiche.
   - Pages déjà faites : accueil.html, actualite_v1.html, statut_v1.html
   ══════════════════════════════════════════════════════════════════════ */
(function () {

  /* ── 1) Textes déjà marqués data-i18n dans accueil.html ── */
  var CLES = {
    FR: { acc_tab_home:'🏠 Accueil', acc_tab_news:'📰 Actualités', acc_tab_status:'Statuts', acc_tab_elite:'⭐ Élites', acc_tab_offers:'Offres', acc_tab_cv:'📄 CV Pro', acc_tab_discussion:'💬 Répert-Discussion', acc_tab_presse:'📰 Fil Presse', acc_tab_faq:'📖 FAQ', acc_search_title:'Rechercher un métier', acc_all_jobs:'Tous les métiers', acc_nav_profile:'Mon Profil', acc_nav_discussion:'Discussion', acc_nav_live:'Live', acc_nav_messages:'Messages', acc_choose_lang:'Choisir la langue' },
    EN: { acc_tab_home:'🏠 Home', acc_tab_news:'📰 News', acc_tab_status:'Status', acc_tab_elite:'⭐ Elite', acc_tab_offers:'Offers', acc_tab_cv:'📄 Pro CV', acc_tab_discussion:'💬 Chat Directory', acc_tab_presse:'📰 Press Feed', acc_tab_faq:'📖 FAQ', acc_search_title:'Search for a trade', acc_all_jobs:'All trades', acc_nav_profile:'My Profile', acc_nav_discussion:'Chat', acc_nav_live:'Live', acc_nav_messages:'Messages', acc_choose_lang:'Choose language' },
    ES: { acc_tab_home:'🏠 Inicio', acc_tab_news:'📰 Noticias', acc_tab_status:'Estados', acc_tab_elite:'⭐ Élite', acc_tab_offers:'Ofertas', acc_tab_cv:'📄 CV Pro', acc_tab_discussion:'💬 Directorio de chats', acc_tab_presse:'📰 Prensa', acc_tab_faq:'📖 FAQ', acc_search_title:'Buscar un oficio', acc_all_jobs:'Todos los oficios', acc_nav_profile:'Mi perfil', acc_nav_discussion:'Chat', acc_nav_live:'En vivo', acc_nav_messages:'Mensajes', acc_choose_lang:'Elegir idioma' },
    PT: { acc_tab_home:'🏠 Início', acc_tab_news:'📰 Notícias', acc_tab_status:'Status', acc_tab_elite:'⭐ Elite', acc_tab_offers:'Ofertas', acc_tab_cv:'📄 CV Pro', acc_tab_discussion:'💬 Diretório de conversas', acc_tab_presse:'📰 Imprensa', acc_tab_faq:'📖 FAQ', acc_search_title:'Pesquisar uma profissão', acc_all_jobs:'Todas as profissões', acc_nav_profile:'Meu perfil', acc_nav_discussion:'Conversa', acc_nav_live:'Ao vivo', acc_nav_messages:'Mensagens', acc_choose_lang:'Escolher idioma' },
    AR: { acc_tab_home:'🏠 الرئيسية', acc_tab_news:'📰 الأخبار', acc_tab_status:'الحالات', acc_tab_elite:'⭐ النخبة', acc_tab_offers:'العروض', acc_tab_cv:'📄 السيرة المهنية', acc_tab_discussion:'💬 دليل المحادثات', acc_tab_presse:'📰 الصحافة', acc_tab_faq:'📖 الأسئلة الشائعة', acc_search_title:'البحث عن مهنة', acc_all_jobs:'كل المهن', acc_nav_profile:'ملفي', acc_nav_discussion:'محادثة', acc_nav_live:'مباشر', acc_nav_messages:'الرسائل', acc_choose_lang:'اختر اللغة' },
    ZH: { acc_tab_home:'🏠 首页', acc_tab_news:'📰 动态', acc_tab_status:'状态', acc_tab_elite:'⭐ 精英', acc_tab_offers:'招聘', acc_tab_cv:'📄 专业简历', acc_tab_discussion:'💬 聊天目录', acc_tab_presse:'📰 新闻', acc_tab_faq:'📖 常见问题', acc_search_title:'搜索职业', acc_all_jobs:'全部职业', acc_nav_profile:'我的主页', acc_nav_discussion:'聊天', acc_nav_live:'直播', acc_nav_messages:'消息', acc_choose_lang:'选择语言' },
    RU: { acc_tab_home:'🏠 Главная', acc_tab_news:'📰 Новости', acc_tab_status:'Статусы', acc_tab_elite:'⭐ Элита', acc_tab_offers:'Предложения', acc_tab_cv:'📄 Резюме', acc_tab_discussion:'💬 Чаты', acc_tab_presse:'📰 Пресса', acc_tab_faq:'📖 Вопросы', acc_search_title:'Поиск профессии', acc_all_jobs:'Все профессии', acc_nav_profile:'Мой профиль', acc_nav_discussion:'Чат', acc_nav_live:'Эфир', acc_nav_messages:'Сообщения', acc_choose_lang:'Выбрать язык' },
    DE: { acc_tab_home:'🏠 Start', acc_tab_news:'📰 Neuigkeiten', acc_tab_status:'Status', acc_tab_elite:'⭐ Elite', acc_tab_offers:'Angebote', acc_tab_cv:'📄 Profi-CV', acc_tab_discussion:'💬 Chat-Verzeichnis', acc_tab_presse:'📰 Presse', acc_tab_faq:'📖 FAQ', acc_search_title:'Beruf suchen', acc_all_jobs:'Alle Berufe', acc_nav_profile:'Mein Profil', acc_nav_discussion:'Chat', acc_nav_live:'Live', acc_nav_messages:'Nachrichten', acc_choose_lang:'Sprache wählen' },
    JA: { acc_tab_home:'🏠 ホーム', acc_tab_news:'📰 ニュース', acc_tab_status:'ステータス', acc_tab_elite:'⭐ エリート', acc_tab_offers:'求人', acc_tab_cv:'📄 プロ履歴書', acc_tab_discussion:'💬 チャット一覧', acc_tab_presse:'📰 プレス', acc_tab_faq:'📖 よくある質問', acc_search_title:'職業を検索', acc_all_jobs:'すべての職業', acc_nav_profile:'マイページ', acc_nav_discussion:'チャット', acc_nav_live:'ライブ', acc_nav_messages:'メッセージ', acc_choose_lang:'言語を選択' },
    HI: { acc_tab_home:'🏠 होम', acc_tab_news:'📰 समाचार', acc_tab_status:'स्टेटस', acc_tab_elite:'⭐ एलीट', acc_tab_offers:'ऑफ़र', acc_tab_cv:'📄 प्रो सीवी', acc_tab_discussion:'💬 चैट सूची', acc_tab_presse:'📰 प्रेस', acc_tab_faq:'📖 सवाल-जवाब', acc_search_title:'पेशा खोजें', acc_all_jobs:'सभी पेशे', acc_nav_profile:'मेरी प्रोफ़ाइल', acc_nav_discussion:'चैट', acc_nav_live:'लाइव', acc_nav_messages:'संदेश', acc_choose_lang:'भाषा चुनें' }
  };

  /* ── 2) Phrases écrites par le code (boutons, messages…) ──
     Chaque ligne : [français, EN, ES, PT, AR, ZH, RU, DE, JA, HI]
     {n}, {p}, {m}, {nom} = valeur remplacée automatiquement.          */
  var LANGUES = ['EN','ES','PT','AR','ZH','RU','DE','JA','HI'];
  var PHRASES = [
    ['Chargement…','Loading…','Cargando…','Carregando…','جارٍ التحميل…','加载中…','Загрузка…','Wird geladen…','読み込み中…','लोड हो रहा है…'],
    ['Fermer','Close','Cerrar','Fechar','إغلاق','关闭','Закрыть','Schließen','閉じる','बंद करें'],
    ['Rechercher un pseudo, un métier, une ville…','Search a username, a trade, a city…','Buscar un usuario, un oficio, una ciudad…','Pesquisar um usuário, uma profissão, uma cidade…','ابحث عن اسم مستخدم أو مهنة أو مدينة…','搜索用户名、职业、城市…','Искать ник, профессию, город…','Nutzername, Beruf oder Stadt suchen…','ユーザー名・職業・都市で検索…','यूज़रनेम, पेशा या शहर खोजें…'],
    ['▶ Live — bientôt disponible','▶ Live — coming soon','▶ En vivo — próximamente','▶ Ao vivo — em breve','▶ البث المباشر — قريبًا','▶ 直播 — 即将推出','▶ Эфир — скоро','▶ Live — demnächst','▶ ライブ — 近日公開','▶ लाइव — जल्द आ रहा है'],
    ['Vérifié','Verified','Verificado','Verificado','موثّق','已认证','Проверен','Verifiziert','認証済み','सत्यापित'],
    ['+ Suivre','+ Follow','+ Seguir','+ Seguir','+ متابعة','+ 关注','+ Подписаться','+ Folgen','+ フォロー','+ फ़ॉलो करें'],
    ['Suivi(e)','Following','Siguiendo','Seguindo','تتابعه','已关注','Вы подписаны','Gefolgt','フォロー中','फ़ॉलो कर रहे हैं'],
    ['✓ Suivi(e)','✓ Following','✓ Siguiendo','✓ Seguindo','✓ تتابعه','✓ 已关注','✓ Вы подписаны','✓ Gefolgt','✓ フォロー中','✓ फ़ॉलो कर रहे हैं'],
    ['Contacter','Contact','Contactar','Contatar','تواصل','联系','Связаться','Kontakt','連絡する','संपर्क करें'],
    ['Réalisation','Portfolio','Trabajos','Trabalhos','أعمالي','作品','Работы','Arbeiten','作品','काम'],
    ['Réserver','Book','Reservar','Reservar','احجز','预约','Записаться','Buchen','予約','बुक करें'],
    ['Professionnel','Professional','Profesional','Profissional','محترف','专业人士','Профессионал','Profi','プロ','पेशेवर'],
    ["🧭 Obtenir l'itinéraire",'🧭 Get directions','🧭 Cómo llegar','🧭 Ver rota','🧭 الحصول على الاتجاهات','🧭 获取路线','🧭 Проложить маршрут','🧭 Route anzeigen','🧭 道順を見る','🧭 रास्ता देखें'],
    ['Téléchargée sur ArtiRoyce','Uploaded on ArtiRoyce','Subido a ArtiRoyce','Enviado no ArtiRoyce','تم الرفع على ArtiRoyce','上传于 ArtiRoyce','Загружено в ArtiRoyce','Hochgeladen auf ArtiRoyce','ArtiRoyce に投稿','ArtiRoyce पर अपलोड किया गया'],
    ['✨ Nos coups de cœur','✨ Our favorites','✨ Nuestros favoritos','✨ Nossos favoritos','✨ اختياراتنا المفضلة','✨ 精选推荐','✨ Наш выбор','✨ Unsere Favoriten','✨ おすすめ','✨ हमारी पसंद'],
    ['Pas intéressé(e)','Not interested','No me interesa','Não tenho interesse','غير مهتم','不感兴趣','Не интересно','Kein Interesse','興味なし','दिलचस्पी नहीं'],
    ['Connecte-toi pour suivre','Log in to follow','Inicia sesión para seguir','Entre para seguir','سجّل الدخول للمتابعة','登录后即可关注','Войдите, чтобы подписаться','Melde dich an, um zu folgen','フォローするにはログイン','फ़ॉलो करने के लिए लॉग इन करें'],
    ['✅ Suivi !','✅ Following!','✅ ¡Siguiendo!','✅ Seguindo!','✅ تمت المتابعة!','✅ 已关注！','✅ Вы подписались!','✅ Gefolgt!','✅ フォローしました！','✅ फ़ॉलो कर लिया!'],
    ['Erreur','Error','Error','Erro','خطأ','出错了','Ошибка','Fehler','エラー','त्रुटि'],
    ['Connecte-toi pour contacter','Log in to contact','Inicia sesión para contactar','Entre para contatar','سجّل الدخول للتواصل','登录后即可联系','Войдите, чтобы связаться','Melde dich an, um Kontakt aufzunehmen','連絡するにはログイン','संपर्क करने के लिए लॉग इन करें'],
    ["C'est votre propre publication",'This is your own post','Es tu propia publicación','É a sua própria publicação','هذا منشورك الخاص','这是你自己的发布','Это ваша собственная публикация','Das ist dein eigener Beitrag','これはあなた自身の投稿です','यह आपकी अपनी पोस्ट है'],
    ['Connecte-toi pour discuter','Log in to chat','Inicia sesión para chatear','Entre para conversar','سجّل الدخول للمحادثة','登录后即可聊天','Войдите, чтобы общаться','Melde dich an, um zu chatten','チャットするにはログイン','चैट करने के लिए लॉग इन करें'],
    ['Connecte-toi pour réagir','Log in to react','Inicia sesión para reaccionar','Entre para reagir','سجّل الدخول للتفاعل','登录后即可互动','Войдите, чтобы отреагировать','Melde dich an, um zu reagieren','リアクションするにはログイン','प्रतिक्रिया देने के लिए लॉग इन करें'],
    ['Tu ne peux pas réagir à ton propre profil','You can’t react to your own profile','No puedes reaccionar a tu propio perfil','Você não pode reagir ao seu próprio perfil','لا يمكنك التفاعل مع ملفك الخاص','不能对自己的主页互动','Нельзя реагировать на свой профиль','Du kannst nicht auf dein eigenes Profil reagieren','自分のプロフィールにはリアクションできません','आप अपनी ही प्रोफ़ाइल पर प्रतिक्रिया नहीं दे सकते'],
    ['Connecte-toi pour sauvegarder','Log in to save','Inicia sesión para guardar','Entre para salvar','سجّل الدخول للحفظ','登录后即可收藏','Войдите, чтобы сохранить','Melde dich an, um zu speichern','保存するにはログイン','सेव करने के लिए लॉग इन करें'],
    ['Retiré des favoris','Removed from favorites','Eliminado de favoritos','Removido dos favoritos','أُزيل من المفضلة','已取消收藏','Удалено из избранного','Aus Favoriten entfernt','お気に入りから削除しました','पसंदीदा से हटाया गया'],
    ['💾 Sauvegardé !','💾 Saved!','💾 ¡Guardado!','💾 Salvo!','💾 تم الحفظ!','💾 已收藏！','💾 Сохранено!','💾 Gespeichert!','💾 保存しました！','💾 सेव हो गया!'],
    ['🔗 Lien copié !','🔗 Link copied!','🔗 ¡Enlace copiado!','🔗 Link copiado!','🔗 تم نسخ الرابط!','🔗 链接已复制！','🔗 Ссылка скопирована!','🔗 Link kopiert!','🔗 リンクをコピーしました！','🔗 लिंक कॉपी हो गया!'],
    ['Connecte-toi pour commenter','Log in to comment','Inicia sesión para comentar','Entre para comentar','سجّل الدخول للتعليق','登录后即可评论','Войдите, чтобы комментировать','Melde dich an, um zu kommentieren','コメントするにはログイン','कमेंट करने के लिए लॉग इन करें'],
    ['Erreur envoi commentaire','Couldn’t send comment','Error al enviar el comentario','Erro ao enviar o comentário','تعذّر إرسال التعليق','评论发送失败','Не удалось отправить комментарий','Kommentar konnte nicht gesendet werden','コメントを送信できませんでした','कमेंट नहीं भेजा जा सका'],
    ['Connecte-toi pour réserver','Log in to book','Inicia sesión para reservar','Entre para reservar','سجّل الدخول للحجز','登录后即可预约','Войдите, чтобы записаться','Melde dich an, um zu buchen','予約するにはログイン','बुक करने के लिए लॉग इन करें'],
    ['Écris un message','Write a message','Escribe un mensaje','Escreva uma mensagem','اكتب رسالة','请填写留言','Напишите сообщение','Schreib eine Nachricht','メッセージを入力してください','एक संदेश लिखें'],
    ['📆 Demande envoyée !','📆 Request sent!','📆 ¡Solicitud enviada!','📆 Pedido enviado!','📆 تم إرسال الطلب!','📆 请求已发送！','📆 Заявка отправлена!','📆 Anfrage gesendet!','📆 リクエストを送信しました！','📆 अनुरोध भेज दिया गया!'],
    ['Erreur envoi demande','Couldn’t send request','Error al enviar la solicitud','Erro ao enviar o pedido','تعذّر إرسال الطلب','请求发送失败','Не удалось отправить заявку','Anfrage konnte nicht gesendet werden','リクエストを送信できませんでした','अनुरोध नहीं भेजा जा सका'],
    ['📍 Adresse non disponible','📍 Address not available','📍 Dirección no disponible','📍 Endereço indisponível','📍 العنوان غير متوفر','📍 暂无地址','📍 Адрес недоступен','📍 Adresse nicht verfügbar','📍 住所がありません','📍 पता उपलब्ध नहीं है'],
    ['🔍 Filtrage : {m}','🔍 Filter: {m}','🔍 Filtro: {m}','🔍 Filtro: {m}','🔍 تصفية: {m}','🔍 筛选：{m}','🔍 Фильтр: {m}','🔍 Filter: {m}','🔍 絞り込み：{m}','🔍 फ़िल्टर: {m}'],
    ['Réalisations','Portfolio','Trabajos','Trabalhos','الأعمال','作品','Работы','Arbeiten','作品','काम'],
    ['🖼️ Réalisations — {p}','🖼️ Portfolio — {p}','🖼️ Trabajos — {p}','🖼️ Trabalhos — {p}','🖼️ الأعمال — {p}','🖼️ 作品 — {p}','🖼️ Работы — {p}','🖼️ Arbeiten — {p}','🖼️ 作品 — {p}','🖼️ काम — {p}'],
    ["Aucune réalisation publiée pour l'instant.",'No work posted yet.','Aún no hay trabajos publicados.','Nenhum trabalho publicado ainda.','لا توجد أعمال منشورة بعد.','暂无作品。','Пока нет опубликованных работ.','Noch keine Arbeiten veröffentlicht.','まだ作品はありません。','अभी तक कोई काम पोस्ट नहीं किया गया।'],
    ['Impossible de charger les réalisations.','Couldn’t load the portfolio.','No se pudieron cargar los trabajos.','Não foi possível carregar os trabalhos.','تعذّر تحميل الأعمال.','作品加载失败。','Не удалось загрузить работы.','Arbeiten konnten nicht geladen werden.','作品を読み込めませんでした。','काम लोड नहीं हो सका।'],
    ['Commentaires','Comments','Comentarios','Comentários','التعليقات','评论','Комментарии','Kommentare','コメント','कमेंट'],
    ['💬 Commentaires — {p}','💬 Comments — {p}','💬 Comentarios — {p}','💬 Comentários — {p}','💬 التعليقات — {p}','💬 评论 — {p}','💬 Комментарии — {p}','💬 Kommentare — {p}','💬 コメント — {p}','💬 कमेंट — {p}'],
    ['Ajouter un commentaire…','Add a comment…','Añade un comentario…','Adicione um comentário…','أضف تعليقًا…','添加评论…','Добавьте комментарий…','Kommentar hinzufügen…','コメントを追加…','कमेंट जोड़ें…'],
    ['Créateur','Creator','Creador','Criador','المنشئ','作者','Автор','Ersteller','クリエイター','क्रिएटर'],
    ['Visiteur','Visitor','Visitante','Visitante','زائر','访客','Гость','Besucher','ビジター','विज़िटर'],
    ['Anonyme','Anonymous','Anónimo','Anônimo','مجهول','匿名','Аноним','Anonym','匿名','अज्ञात'],
    ['Aimé','Liked','Te gusta','Curtido','أعجبني','已赞','Нравится','Gefällt dir','いいね済み','पसंद किया'],
    ["J'aime",'Like','Me gusta','Curtir','أعجبني','赞','Нравится','Gefällt mir','いいね','पसंद'],
    ['Répondre','Reply','Responder','Responder','رد','回复','Ответить','Antworten','返信','जवाब दें'],
    ["Aucun commentaire pour l'instant.",'No comments yet.','Aún no hay comentarios.','Nenhum comentário ainda.','لا توجد تعليقات بعد.','暂无评论。','Пока нет комментариев.','Noch keine Kommentare.','まだコメントはありません。','अभी कोई कमेंट नहीं है।'],
    ['— Afficher {n} réponse ▾','— View {n} reply ▾','— Ver {n} respuesta ▾','— Ver {n} resposta ▾','— عرض {n} رد ▾','— 查看 {n} 条回复 ▾','— Показать ответ ({n}) ▾','— {n} Antwort anzeigen ▾','— 返信 {n} 件を表示 ▾','— {n} जवाब देखें ▾'],
    ['— Afficher {n} réponses ▾','— View {n} replies ▾','— Ver {n} respuestas ▾','— Ver {n} respostas ▾','— عرض {n} ردود ▾','— 查看 {n} 条回复 ▾','— Показать ответы ({n}) ▾','— {n} Antworten anzeigen ▾','— 返信 {n} 件を表示 ▾','— {n} जवाब देखें ▾'],
    ['Impossible de charger les commentaires.','Couldn’t load comments.','No se pudieron cargar los comentarios.','Não foi possível carregar os comentários.','تعذّر تحميل التعليقات.','评论加载失败。','Не удалось загрузить комментарии.','Kommentare konnten nicht geladen werden.','コメントを読み込めませんでした。','कमेंट लोड नहीं हो सके।'],
    ['Réponse à {nom}','Replying to {nom}','Respondiendo a {nom}','Respondendo a {nom}','الرد على {nom}','回复 {nom}','Ответ для {nom}','Antwort an {nom}','{nom} さんへの返信','{nom} को जवाब'],
    ["à l'instant",'just now','ahora mismo','agora mesmo','الآن','刚刚','только что','gerade eben','たった今','अभी-अभी'],
    ['il y a {n}min','{n}m ago','hace {n} min','há {n} min','منذ {n} د','{n}分钟前','{n} мин назад','vor {n} Min.','{n}分前','{n} मिनट पहले'],
    ['il y a {n}h','{n}h ago','hace {n} h','há {n} h','منذ {n} س','{n}小时前','{n} ч назад','vor {n} Std.','{n}時間前','{n} घंटे पहले'],
    ['il y a {n}j','{n}d ago','hace {n} d','há {n} d','منذ {n} ي','{n}天前','{n} дн назад','vor {n} T.','{n}日前','{n} दिन पहले'],
    ['Demande de rendez-vous','Appointment request','Solicitud de cita','Pedido de agendamento','طلب موعد','预约请求','Заявка на встречу','Terminanfrage','予約リクエスト','अपॉइंटमेंट अनुरोध'],
    ['📆 Demande de rendez-vous — {p}','📆 Appointment request — {p}','📆 Solicitud de cita — {p}','📆 Pedido de agendamento — {p}','📆 طلب موعد — {p}','📆 预约请求 — {p}','📆 Заявка на встречу — {p}','📆 Terminanfrage — {p}','📆 予約リクエスト — {p}','📆 अपॉइंटमेंट अनुरोध — {p}'],
    ['Décris ta demande (date souhaitée, besoin...)','Describe your request (preferred date, need...)','Describe tu solicitud (fecha deseada, necesidad...)','Descreva seu pedido (data desejada, necessidade...)','صف طلبك (التاريخ المطلوب، الحاجة...)','描述你的需求（期望日期、需求…）','Опишите запрос (желаемая дата, задача...)','Beschreibe deine Anfrage (Wunschtermin, Bedarf...)','ご希望の内容（希望日、内容など）','अपना अनुरोध लिखें (पसंदीदा तारीख, ज़रूरत...)'],
    ['Envoyer la demande','Send request','Enviar solicitud','Enviar pedido','إرسال الطلب','发送请求','Отправить заявку','Anfrage senden','リクエストを送信','अनुरोध भेजें'],
    ['Comment voulez-vous voir le chemin ?','How would you like to see the way?','¿Cómo quieres ver el camino?','Como você quer ver o caminho?','كيف تريد رؤية الطريق؟','你想如何查看路线？','Как показать дорогу?','Wie möchtest du den Weg sehen?','道順をどのように表示しますか？','आप रास्ता कैसे देखना चाहते हैं?'],
    ['🧭 Itinéraire Google Maps','🧭 Google Maps directions','🧭 Ruta en Google Maps','🧭 Rota no Google Maps','🧭 الاتجاهات في Google Maps','🧭 Google 地图路线','🧭 Маршрут в Google Maps','🧭 Route in Google Maps','🧭 Google マップで道順','🧭 Google Maps पर रास्ता'],
    ["🎥 Vidéo d'itinéraire",'🎥 Directions video','🎥 Video del camino','🎥 Vídeo do caminho','🎥 فيديو الطريق','🎥 路线视频','🎥 Видео маршрута','🎥 Wegbeschreibung als Video','🎥 道順の動画','🎥 रास्ते का वीडियो'],
    ['{n} métier disponible','{n} trade available','{n} oficio disponible','{n} profissão disponível','{n} مهنة متاحة','共 {n} 个职业','Доступно профессий: {n}','{n} Beruf verfügbar','{n} 件の職業','{n} पेशा उपलब्ध'],
    ['{n} métiers disponibles','{n} trades available','{n} oficios disponibles','{n} profissões disponíveis','{n} مهن متاحة','共 {n} 个职业','Доступно профессий: {n}','{n} Berufe verfügbar','{n} 件の職業','{n} पेशे उपलब्ध'],
    ['Aucun résultat','No results','Sin resultados','Nenhum resultado','لا توجد نتائج','没有结果','Ничего не найдено','Keine Ergebnisse','結果なし','कोई नतीजा नहीं'],
    /* ── Actualités (actualite_v1.html) ── */
    ['Tout','All','Todo','Tudo','الكل','全部','Все','Alle','すべて','सभी'],
    ['🛍️ Vente','🛍️ Sales','🛍️ Venta','🛍️ Venda','🛍️ بيع','🛍️ 销售','🛍️ Продажа','🛍️ Verkauf','🛍️ 販売','🛍️ बिक्री'],
    ['🎨 Arts','🎨 Arts','🎨 Arte','🎨 Artes','🎨 فنون','🎨 艺术','🎨 Искусство','🎨 Kunst','🎨 アート','🎨 कला'],
    ['👗 Mode','👗 Fashion','👗 Moda','👗 Moda','👗 موضة','👗 时尚','👗 Мода','👗 Mode','👗 ファッション','👗 फ़ैशन'],
    ['🎉 Événements','🎉 Events','🎉 Eventos','🎉 Eventos','🎉 فعاليات','🎉 活动','🎉 События','🎉 Events','🎉 イベント','🎉 इवेंट'],
    ['🎉 Événement','🎉 Event','🎉 Evento','🎉 Evento','🎉 فعالية','🎉 活动','🎉 Событие','🎉 Event','🎉 イベント','🎉 इवेंट'],
    ['💼 Business','💼 Business','💼 Negocios','💼 Negócios','💼 أعمال','💼 商业','💼 Бизнес','💼 Business','💼 ビジネス','💼 बिज़नेस'],
    ['Publier un produit (bijoux, accessoires, mode...)','Post a product (jewelry, accessories, fashion...)','Publica un producto (joyas, accesorios, moda...)','Publique um produto (joias, acessórios, moda...)','انشر منتجًا (مجوهرات، إكسسوارات، موضة...)','发布商品（首饰、配饰、时尚…）','Опубликуйте товар (украшения, аксессуары, мода...)','Produkt posten (Schmuck, Accessoires, Mode...)','商品を投稿（ジュエリー、小物、ファッション…）','प्रोडक्ट पोस्ट करें (गहने, एक्सेसरीज़, फ़ैशन...)'],
    ['🔒 Publication réservée aux professionnels','🔒 Posting is for professionals only','🔒 Publicar es solo para profesionales','🔒 Publicação reservada a profissionais','🔒 النشر مخصص للمحترفين','🔒 仅专业人士可发布','🔒 Публикация только для профессионалов','🔒 Posten nur für Profis','🔒 投稿はプロ専用です','🔒 पोस्ट करना सिर्फ़ पेशेवरों के लिए है'],
    ['🔒 La publication est réservée aux professionnels','🔒 Posting is reserved for professionals','🔒 Publicar está reservado a profesionales','🔒 A publicação é reservada a profissionais','🔒 النشر مخصص للمحترفين فقط','🔒 发布仅限专业人士','🔒 Публиковать могут только профессионалы','🔒 Posten ist Profis vorbehalten','🔒 投稿はプロのみ可能です','🔒 पोस्ट करना केवल पेशेवरों के लिए है'],
    ['Rechercher un article, une ville, une catégorie…','Search a post, a city, a category…','Busca un artículo, una ciudad, una categoría…','Pesquise um artigo, uma cidade, uma categoria…','ابحث عن منشور أو مدينة أو فئة…','搜索内容、城市、分类…','Искать публикацию, город, категорию…','Beitrag, Stadt oder Kategorie suchen…','投稿・都市・カテゴリで検索…','पोस्ट, शहर या कैटेगरी खोजें…'],
    ['Corbeille ({n})','Trash ({n})','Papelera ({n})','Lixeira ({n})','سلة المحذوفات ({n})','回收站（{n}）','Корзина ({n})','Papierkorb ({n})','ゴミ箱（{n}）','ट्रैश ({n})'],
    ['Annuler','Cancel','Cancelar','Cancelar','إلغاء','取消','Отмена','Abbrechen','キャンセル','रद्द करें'],
    ['Créer une publication','Create a post','Crear una publicación','Criar uma publicação','إنشاء منشور','创建发布','Создать публикацию','Beitrag erstellen','投稿を作成','पोस्ट बनाएँ'],
    ['Publier','Post','Publicar','Publicar','نشر','发布','Опубликовать','Posten','投稿','पोस्ट करें'],
    ['Choisissez comment partager votre actualité — puis remplissez et publiez, sans détour.','Choose how to share your news — then fill it in and post, simple as that.','Elige cómo compartir tu novedad — luego complétala y publica, sin rodeos.','Escolha como compartilhar sua novidade — depois preencha e publique, sem complicação.','اختر طريقة مشاركة خبرك — ثم املأ وانشر مباشرة.','选择分享动态的方式 — 填写后直接发布。','Выберите, как поделиться новостью — заполните и публикуйте, без лишних шагов.','Wähle, wie du deine Neuigkeit teilst — ausfüllen und posten, ganz einfach.','共有の方法を選び、入力してそのまま投稿しましょう。','चुनें कि अपनी खबर कैसे शेयर करें — फिर भरें और सीधे पोस्ट करें।'],
    ['Texte','Text','Texto','Texto','نص','文字','Текст','Text','テキスト','टेक्स्ट'],
    ['Un message simple, sans photo','A simple message, no photo','Un mensaje simple, sin foto','Uma mensagem simples, sem foto','رسالة بسيطة بدون صورة','简单文字，无图片','Простое сообщение без фото','Eine einfache Nachricht ohne Foto','写真なしのシンプルなメッセージ','बिना फ़ोटो का आसान संदेश'],
    ['Photo · Galerie','Photo · Gallery','Foto · Galería','Foto · Galeria','صورة · معرض','照片 · 相册','Фото · Галерея','Foto · Galerie','写真・ギャラリー','फ़ोटो · गैलरी'],
    ['1 à 8 photos','1 to 8 photos','De 1 a 8 fotos','De 1 a 8 fotos','من 1 إلى 8 صور','1 至 8 张照片','От 1 до 8 фото','1 bis 8 Fotos','写真 1〜8 枚','1 से 8 फ़ोटो'],
    ['Boutique','Shop','Tienda','Loja','متجر','店铺','Магазин','Shop','ショップ','दुकान'],
    ['Photos + nom + prix','Photos + name + price','Fotos + nombre + precio','Fotos + nome + preço','صور + اسم + سعر','照片 + 名称 + 价格','Фото + название + цена','Fotos + Name + Preis','写真 + 名前 + 価格','फ़ोटो + नाम + कीमत'],
    ['Quoi de neuf ? Partagez votre actualité…','What’s new? Share your news…','¿Qué hay de nuevo? Comparte tu novedad…','O que há de novo? Compartilhe sua novidade…','ما الجديد؟ شارك خبرك…','有什么新鲜事？分享你的动态…','Что нового? Поделитесь новостью…','Was gibt’s Neues? Teile deine Neuigkeit…','最近どう？ニュースを共有しよう…','क्या नया है? अपनी खबर शेयर करें…'],
    ['Une légende (facultatif)…','A caption (optional)…','Un pie de foto (opcional)…','Uma legenda (opcional)…','تعليق على الصورة (اختياري)…','配文（可选）…','Подпись (необязательно)…','Bildunterschrift (optional)…','キャプション（任意）…','कैप्शन (वैकल्पिक)…'],
    ['🎨 Étiquettes','🎨 Labels','🎨 Etiquetas','🎨 Etiquetas','🎨 الملصقات','🎨 标签','🎨 Ярлыки','🎨 Etiketten','🎨 ラベル','🎨 लेबल'],
    ['Touchez un cadre vide pour ajouter une photo, avec son nom et son prix','Tap an empty frame to add a photo, with its name and price','Toca un marco vacío para añadir una foto, con su nombre y precio','Toque num quadro vazio para adicionar uma foto, com nome e preço','اضغط على إطار فارغ لإضافة صورة مع اسمها وسعرها','点击空白框添加照片，并填写名称和价格','Нажмите на пустую рамку, чтобы добавить фото с названием и ценой','Tippe auf einen leeren Rahmen, um ein Foto mit Name und Preis hinzuzufügen','空の枠をタップして、名前と価格つきの写真を追加','खाली फ़्रेम पर टैप करके नाम और कीमत के साथ फ़ोटो जोड़ें'],
    ['Chargement des publications…','Loading posts…','Cargando publicaciones…','Carregando publicações…','جارٍ تحميل المنشورات…','正在加载发布…','Загрузка публикаций…','Beiträge werden geladen…','投稿を読み込み中…','पोस्ट लोड हो रही हैं…'],
    ["Aucune publication pour l'instant.",'No posts yet.','Aún no hay publicaciones.','Nenhuma publicação ainda.','لا توجد منشورات بعد.','暂无发布。','Публикаций пока нет.','Noch keine Beiträge.','まだ投稿はありません。','अभी कोई पोस्ट नहीं है।'],
    ['Vous ne suivez plus cette personne (Actualités)','You no longer follow this person (News)','Ya no sigues a esta persona (Noticias)','Você deixou de seguir esta pessoa (Notícias)','لم تعد تتابع هذا الشخص (الأخبار)','已取消关注此人（动态）','Вы отписались от этого человека (Новости)','Du folgst dieser Person nicht mehr (Neuigkeiten)','この人のフォローを解除しました（ニュース）','आपने इस व्यक्ति को अनफ़ॉलो कर दिया (समाचार)'],
    ['✅ Abonné(e) aux actualités de cette personne !','✅ Following this person’s news!','✅ ¡Sigues las novedades de esta persona!','✅ Você segue as novidades desta pessoa!','✅ أنت تتابع أخبار هذا الشخص!','✅ 已关注此人的动态！','✅ Вы подписались на новости этого человека!','✅ Du folgst jetzt den Neuigkeiten dieser Person!','✅ この人のニュースをフォローしました！','✅ आप इस व्यक्ति की खबरें फ़ॉलो कर रहे हैं!'],
    ['Connectez-vous pour contacter','Log in to contact','Inicia sesión para contactar','Entre para contatar','سجّل الدخول للتواصل','登录后即可联系','Войдите, чтобы связаться','Melde dich an, um Kontakt aufzunehmen','連絡するにはログイン','संपर्क करने के लिए लॉग इन करें'],
    ['Contact indisponible pour cette publication','Contact unavailable for this post','Contacto no disponible para esta publicación','Contato indisponível para esta publicação','التواصل غير متاح لهذا المنشور','此发布无法联系','Связь недоступна для этой публикации','Kontakt für diesen Beitrag nicht verfügbar','この投稿には連絡できません','इस पोस्ट के लिए संपर्क उपलब्ध नहीं है'],
    ["Vous êtes l'auteur de cette publication",'You are the author of this post','Eres el autor de esta publicación','Você é o autor desta publicação','أنت كاتب هذا المنشور','你是此发布的作者','Вы автор этой публикации','Du bist der Autor dieses Beitrags','あなたはこの投稿の作成者です','आप इस पोस्ट के लेखक हैं'],
    ['📞 Contact direct bientôt disponible — utilisez la messagerie ArtiRoyce pour le moment','📞 Direct contact coming soon — use ArtiRoyce messages for now','📞 Contacto directo próximamente — usa la mensajería de ArtiRoyce por ahora','📞 Contato direto em breve — use as mensagens do ArtiRoyce por enquanto','📞 التواصل المباشر قريبًا — استخدم رسائل ArtiRoyce حاليًا','📞 直接联系即将推出 — 目前请使用 ArtiRoyce 消息','📞 Прямая связь скоро — пока пользуйтесь сообщениями ArtiRoyce','📞 Direktkontakt kommt bald — nutze vorerst die ArtiRoyce-Nachrichten','📞 直接連絡は近日公開 — 今は ArtiRoyce メッセージをご利用ください','📞 सीधा संपर्क जल्द — अभी ArtiRoyce मैसेज इस्तेमाल करें'],
    ['il y a peu','just now','hace poco','há pouco','منذ قليل','刚刚','только что','gerade eben','少し前','अभी-अभी'],
    ['il y a {n} sem.','{n}w ago','hace {n} sem.','há {n} sem.','منذ {n} أسابيع','{n}周前','{n} нед. назад','vor {n} Wo.','{n}週間前','{n} हफ़्ते पहले'],
    ['il y a {n} mois','{n} mo ago','hace {n} meses','há {n} meses','منذ {n} أشهر','{n}个月前','{n} мес. назад','vor {n} Mon.','{n}か月前','{n} महीने पहले'],
    ['Connectez-vous pour réagir','Log in to react','Inicia sesión para reaccionar','Entre para reagir','سجّل الدخول للتفاعل','登录后即可互动','Войдите, чтобы отреагировать','Melde dich an, um zu reagieren','リアクションするにはログイン','प्रतिक्रिया देने के लिए लॉग इन करें'],
    ["Erreur J'aime",'Like error','Error al dar Me gusta','Erro ao curtir','خطأ في الإعجاب','点赞失败','Ошибка «Нравится»','Fehler bei „Gefällt mir“','いいねのエラー','लाइक में त्रुटि'],
    ['Partagé ✅','Shared ✅','Compartido ✅','Compartilhado ✅','تمت المشاركة ✅','已分享 ✅','Отправлено ✅','Geteilt ✅','共有しました ✅','शेयर किया ✅'],
    ['Connectez-vous pour commenter','Log in to comment','Inicia sesión para comentar','Entre para comentar','سجّل الدخول للتعليق','登录后即可评论','Войдите, чтобы комментировать','Melde dich an, um zu kommentieren','コメントするにはログイン','कमेंट करने के लिए लॉग इन करें'],
    ['{n} commentaire','{n} comment','{n} comentario','{n} comentário','{n} تعليق','{n} 条评论','Комментариев: {n}','{n} Kommentar','コメント {n} 件','{n} कमेंट'],
    ['{n} commentaires','{n} comments','{n} comentarios','{n} comentários','{n} تعليقات','{n} 条评论','Комментариев: {n}','{n} Kommentare','コメント {n} 件','{n} कमेंट'],
    ['{n} partage','{n} share','{n} vez compartido','{n} compartilhamento','{n} مشاركة','{n} 次分享','Репостов: {n}','{n}× geteilt','シェア {n} 件','{n} शेयर'],
    ['{n} partages','{n} shares','{n} veces compartido','{n} compartilhamentos','{n} مشاركات','{n} 次分享','Репостов: {n}','{n}× geteilt','シェア {n} 件','{n} शेयर'],
    ['Sans titre','Untitled','Sin título','Sem título','بدون عنوان','无标题','Без названия','Ohne Titel','無題','बिना शीर्षक'],
    ['Publication','Post','Publicación','Publicação','منشور','发布','Публикация','Beitrag','投稿','पोस्ट'],
    ['Supprimée définitivement dans {n} jour','Permanently deleted in {n} day','Se eliminará definitivamente en {n} día','Excluída definitivamente em {n} dia','ستُحذف نهائيًا خلال {n} يوم','{n} 天后永久删除','Будет удалено через {n} дн.','Endgültig gelöscht in {n} Tag','{n} 日後に完全に削除','{n} दिन में हमेशा के लिए हट जाएगी'],
    ['Supprimée définitivement dans {n} jours','Permanently deleted in {n} days','Se eliminará definitivamente en {n} días','Excluída definitivamente em {n} dias','ستُحذف نهائيًا خلال {n} أيام','{n} 天后永久删除','Будет удалено через {n} дн.','Endgültig gelöscht in {n} Tagen','{n} 日後に完全に削除','{n} दिनों में हमेशा के लिए हट जाएगी'],
    ['Restaurer','Restore','Restaurar','Restaurar','استعادة','恢复','Восстановить','Wiederherstellen','復元','वापस लाएँ'],
    ['Supprimer','Delete','Eliminar','Excluir','حذف','删除','Удалить','Löschen','削除','हटाएँ'],
    ['Mettre cette publication à la corbeille ? Elle sera restaurable pendant 15 jours.','Move this post to the trash? You can restore it for 15 days.','¿Mover esta publicación a la papelera? Podrás restaurarla durante 15 días.','Mover esta publicação para a lixeira? Poderá restaurá-la por 15 dias.','نقل هذا المنشور إلى سلة المحذوفات؟ يمكن استعادته خلال 15 يومًا.','将此发布移到回收站？15 天内可恢复。','Переместить публикацию в корзину? Её можно восстановить в течение 15 дней.','Diesen Beitrag in den Papierkorb verschieben? Er kann 15 Tage lang wiederhergestellt werden.','この投稿をゴミ箱に移しますか？15日間は復元できます。','इस पोस्ट को ट्रैश में डालें? इसे 15 दिनों तक वापस लाया जा सकता है।'],
    ['Restaurer cette publication ? Elle réapparaîtra dans le fil.','Restore this post? It will reappear in the feed.','¿Restaurar esta publicación? Volverá a aparecer en el feed.','Restaurar esta publicação? Ela voltará a aparecer no feed.','استعادة هذا المنشور؟ سيظهر مجددًا في الصفحة.','恢复此发布？它将重新出现在动态中。','Восстановить публикацию? Она снова появится в ленте.','Diesen Beitrag wiederherstellen? Er erscheint wieder im Feed.','この投稿を復元しますか？フィードに再表示されます。','इस पोस्ट को वापस लाएँ? यह फ़ीड में फिर दिखेगी।'],
    ['Supprimer définitivement cette publication ? Cette action est irréversible.','Delete this post permanently? This cannot be undone.','¿Eliminar definitivamente esta publicación? Esta acción es irreversible.','Excluir definitivamente esta publicação? Esta ação é irreversível.','حذف هذا المنشور نهائيًا؟ لا يمكن التراجع عن ذلك.','永久删除此发布？此操作无法撤销。','Удалить публикацию навсегда? Это действие необратимо.','Diesen Beitrag endgültig löschen? Das kann nicht rückgängig gemacht werden.','この投稿を完全に削除しますか？元に戻せません。','इस पोस्ट को हमेशा के लिए हटाएँ? यह वापस नहीं होगा।'],
    ['🗑️ Publication mise à la corbeille','🗑️ Post moved to trash','🗑️ Publicación movida a la papelera','🗑️ Publicação movida para a lixeira','🗑️ نُقل المنشور إلى سلة المحذوفات','🗑️ 已移到回收站','🗑️ Публикация в корзине','🗑️ Beitrag in den Papierkorb verschoben','🗑️ 投稿をゴミ箱に移しました','🗑️ पोस्ट ट्रैश में डाल दी गई'],
    ['Erreur lors de la suppression','Error while deleting','Error al eliminar','Erro ao excluir','خطأ أثناء الحذف','删除时出错','Ошибка при удалении','Fehler beim Löschen','削除中にエラーが発生しました','हटाते समय त्रुटि'],
    ['♻️ Publication restaurée','♻️ Post restored','♻️ Publicación restaurada','♻️ Publicação restaurada','♻️ تمت استعادة المنشور','♻️ 已恢复发布','♻️ Публикация восстановлена','♻️ Beitrag wiederhergestellt','♻️ 投稿を復元しました','♻️ पोस्ट वापस आ गई'],
    ['Erreur lors de la restauration','Error while restoring','Error al restaurar','Erro ao restaurar','خطأ أثناء الاستعادة','恢复时出错','Ошибка при восстановлении','Fehler beim Wiederherstellen','復元中にエラーが発生しました','वापस लाते समय त्रुटि'],
    ['Publication supprimée définitivement','Post permanently deleted','Publicación eliminada definitivamente','Publicação excluída definitivamente','تم حذف المنشور نهائيًا','发布已永久删除','Публикация удалена навсегда','Beitrag endgültig gelöscht','投稿を完全に削除しました','पोस्ट हमेशा के लिए हटा दी गई'],
    ['Erreur lors de la suppression définitive','Error while permanently deleting','Error al eliminar definitivamente','Erro ao excluir definitivamente','خطأ أثناء الحذف النهائي','永久删除时出错','Ошибка при окончательном удалении','Fehler beim endgültigen Löschen','完全削除中にエラーが発生しました','हमेशा के लिए हटाते समय त्रुटि'],
    ['Nos coups de cœur','Our favorites','Nuestros favoritos','Nossos favoritos','اختياراتنا المفضلة','精选推荐','Наш выбор','Unsere Favoriten','おすすめ','हमारी पसंद'],
    ['🗑️ Mettre à la corbeille','🗑️ Move to trash','🗑️ Mover a la papelera','🗑️ Mover para a lixeira','🗑️ نقل إلى سلة المحذوفات','🗑️ 移到回收站','🗑️ В корзину','🗑️ In den Papierkorb','🗑️ ゴミ箱に移す','🗑️ ट्रैश में डालें'],
    ['Super','Great','Genial','Ótimo','رائع','超赞','Супер','Super','すごい','बढ़िया'],
    ['Wow','Wow','Guau','Uau','واو','哇','Вау','Wow','ワオ','वाह'],
    ['Haha','Haha','Jaja','Haha','هههه','哈哈','Ха-ха','Haha','ハハ','हाहा'],
    ['Feu','Fire','Fuego','Fogo','نار','火爆','Огонь','Feuer','最高','आग'],
    ['Triste','Sad','Triste','Triste','حزين','难过','Грустно','Traurig','悲しい','दुखी'],
    ['Commenter','Comment','Comentar','Comentar','تعليق','评论','Комментировать','Kommentieren','コメント','कमेंट करें'],
    ['Partager','Share','Compartir','Compartilhar','مشاركة','分享','Поделиться','Teilen','シェア','शेयर करें'],
    ['Connexion requise','Login required','Inicio de sesión requerido','Login necessário','يلزم تسجيل الدخول','需要登录','Требуется вход','Anmeldung erforderlich','ログインが必要です','लॉग इन ज़रूरी है'],
    ['Retour','Back','Volver','Voltar','رجوع','返回','Назад','Zurück','戻る','वापस'],
    ['Publication texte','Text post','Publicación de texto','Publicação de texto','منشور نصي','文字发布','Текстовая публикация','Textbeitrag','テキスト投稿','टेक्स्ट पोस्ट'],
    ['Photo illisible, réessayez','Unreadable photo, try again','Foto ilegible, inténtalo de nuevo','Foto ilegível, tente novamente','الصورة غير قابلة للقراءة، أعد المحاولة','照片无法读取，请重试','Фото не читается, попробуйте снова','Foto nicht lesbar, bitte erneut versuchen','写真を読み込めません。もう一度お試しください','फ़ोटो पढ़ी नहीं जा सकी, फिर कोशिश करें'],
    ['Nom…','Name…','Nombre…','Nome…','الاسم…','名称…','Название…','Name…','名前…','नाम…'],
    ['Prix…','Price…','Precio…','Preço…','السعر…','价格…','Цена…','Preis…','価格…','कीमत…'],
    ['Écrivez un message avant de publier','Write a message before posting','Escribe un mensaje antes de publicar','Escreva uma mensagem antes de publicar','اكتب رسالة قبل النشر','发布前请先写内容','Напишите сообщение перед публикацией','Schreib eine Nachricht vor dem Posten','投稿する前にメッセージを入力してください','पोस्ट करने से पहले संदेश लिखें'],
    ['Ajoutez au moins une photo','Add at least one photo','Añade al menos una foto','Adicione pelo menos uma foto','أضف صورة واحدة على الأقل','请至少添加一张照片','Добавьте хотя бы одно фото','Füge mindestens ein Foto hinzu','写真を1枚以上追加してください','कम से कम एक फ़ोटो जोड़ें'],
    ['Ajoutez au moins un article avec photo','Add at least one item with a photo','Añade al menos un artículo con foto','Adicione pelo menos um item com foto','أضف منتجًا واحدًا على الأقل مع صورة','请至少添加一件带照片的商品','Добавьте хотя бы один товар с фото','Füge mindestens einen Artikel mit Foto hinzu','写真つきの商品を1つ以上追加してください','कम से कम एक फ़ोटो वाला आइटम जोड़ें'],
    ['Publication…','Posting…','Publicando…','Publicando…','جارٍ النشر…','发布中…','Публикация…','Wird gepostet…','投稿中…','पोस्ट हो रहा है…'],
    ['Publié ✅','Posted ✅','Publicado ✅','Publicado ✅','تم النشر ✅','已发布 ✅','Опубликовано ✅','Gepostet ✅','投稿しました ✅','पोस्ट हो गया ✅'],
    ['Erreur : publication impossible','Error: could not post','Error: no se pudo publicar','Erro: não foi possível publicar','خطأ: تعذّر النشر','错误：无法发布','Ошибка: не удалось опубликовать','Fehler: Posten nicht möglich','エラー：投稿できませんでした','त्रुटि: पोस्ट नहीं हो सका'],
    /* ── Filigrane : enregistrer avec la marque (filigrane.js) ── */
    ['Sauver','Save','Guardar','Salvar','حفظ','保存','Сохранить','Speichern','保存','सेव करें'],
    ['⭐ Ajouter aux favoris','⭐ Add to favorites','⭐ Añadir a favoritos','⭐ Adicionar aos favoritos','⭐ إضافة إلى المفضلة','⭐ 加入收藏','⭐ В избранное','⭐ Zu Favoriten hinzufügen','⭐ お気に入りに追加','⭐ पसंदीदा में जोड़ें'],
    ['⭐ Retirer des favoris','⭐ Remove from favorites','⭐ Quitar de favoritos','⭐ Remover dos favoritos','⭐ إزالة من المفضلة','⭐ 取消收藏','⭐ Убрать из избранного','⭐ Aus Favoriten entfernen','⭐ お気に入りから削除','⭐ पसंदीदा से हटाएँ'],
    ['📥 Enregistrer sur le téléphone','📥 Save to phone','📥 Guardar en el teléfono','📥 Salvar no celular','📥 حفظ في الهاتف','📥 保存到手机','📥 Сохранить на телефон','📥 Aufs Handy speichern','📥 スマホに保存','📥 फ़ोन में सेव करें'],
    ['📥 Enregistrer les {n} photos sur le téléphone','📥 Save the {n} photos to phone','📥 Guardar las {n} fotos en el teléfono','📥 Salvar as {n} fotos no celular','📥 حفظ الصور الـ {n} في الهاتف','📥 将 {n} 张照片保存到手机','📥 Сохранить {n} фото на телефон','📥 Die {n} Fotos aufs Handy speichern','📥 {n} 枚の写真をスマホに保存','📥 {n} फ़ोटो फ़ोन में सेव करें'],
    ['Enregistrer','Save','Guardar','Salvar','حفظ','保存','Сохранить','Speichern','保存','सेव करें'],
    ['📥 Enregistrer cette photo','📥 Save this photo','📥 Guardar esta foto','📥 Salvar esta foto','📥 حفظ هذه الصورة','📥 保存这张照片','📥 Сохранить это фото','📥 Dieses Foto speichern','📥 この写真を保存','📥 यह फ़ोटो सेव करें'],
    ['🔗 Partager','🔗 Share','🔗 Compartir','🔗 Compartilhar','🔗 مشاركة','🔗 分享','🔗 Поделиться','🔗 Teilen','🔗 シェア','🔗 शेयर करें'],
    ['Préparation…','Preparing…','Preparando…','Preparando…','جارٍ التحضير…','准备中…','Подготовка…','Wird vorbereitet…','準備中…','तैयारी हो रही है…'],
    ['Ne quittez pas cet écran','Don’t leave this screen','No salgas de esta pantalla','Não saia desta tela','لا تغادر هذه الشاشة','请勿离开此页面','Не уходите с этого экрана','Bleib auf diesem Bildschirm','この画面のままお待ちください','यह स्क्रीन न छोड़ें'],
    ['Arrêter','Stop','Detener','Parar','إيقاف','停止','Остановить','Stoppen','停止','रोकें'],
    ['📥 Photo {n} sur {t}…','📥 Photo {n} of {t}…','📥 Foto {n} de {t}…','📥 Foto {n} de {t}…','📥 الصورة {n} من {t}…','📥 第 {n}/{t} 张照片…','📥 Фото {n} из {t}…','📥 Foto {n} von {t}…','📥 写真 {n}/{t}…','📥 फ़ोटो {n} / {t}…'],
    ['✅ Enregistré dans votre téléphone','✅ Saved to your phone','✅ Guardado en tu teléfono','✅ Salvo no seu celular','✅ تم الحفظ في هاتفك','✅ 已保存到手机','✅ Сохранено на телефон','✅ Auf deinem Handy gespeichert','✅ スマホに保存しました','✅ आपके फ़ोन में सेव हो गया'],
    ['✅ {n} photos enregistrées','✅ {n} photos saved','✅ {n} fotos guardadas','✅ {n} fotos salvas','✅ تم حفظ {n} صور','✅ 已保存 {n} 张照片','✅ Сохранено фото: {n}','✅ {n} Fotos gespeichert','✅ {n} 枚の写真を保存しました','✅ {n} फ़ोटो सेव हो गईं'],
    ['✅ Enregistré (sans le son)','✅ Saved (without sound)','✅ Guardado (sin sonido)','✅ Salvo (sem som)','✅ تم الحفظ (بدون صوت)','✅ 已保存（无声音）','✅ Сохранено (без звука)','✅ Gespeichert (ohne Ton)','✅ 保存しました（音声なし）','✅ सेव हो गया (बिना आवाज़)'],
    ['Aucune photo à enregistrer','No photo to save','No hay fotos para guardar','Nenhuma foto para salvar','لا توجد صورة للحفظ','没有可保存的照片','Нет фото для сохранения','Kein Foto zum Speichern','保存する写真がありません','सेव करने के लिए कोई फ़ोटो नहीं'],
    ['Aucune vidéo à enregistrer','No video to save','No hay video para guardar','Nenhum vídeo para salvar','لا يوجد فيديو للحفظ','没有可保存的视频','Нет видео для сохранения','Kein Video zum Speichern','保存する動画がありません','सेव करने के लिए कोई वीडियो नहीं'],
    ['🎬 Enregistrement avec la marque…','🎬 Saving with the watermark…','🎬 Guardando con la marca…','🎬 Salvando com a marca…','🎬 جارٍ الحفظ مع العلامة…','🎬 正在添加水印并保存…','🎬 Сохранение с водяным знаком…','🎬 Speichern mit Wasserzeichen…','🎬 ロゴ付きで保存中…','🎬 वॉटरमार्क के साथ सेव हो रहा है…'],
    ['🎬 Enregistrement avec la marque… {p}%','🎬 Saving with the watermark… {p}%','🎬 Guardando con la marca… {p}%','🎬 Salvando com a marca… {p}%','🎬 جارٍ الحفظ مع العلامة… {p}%','🎬 正在添加水印并保存… {p}%','🎬 Сохранение с водяным знаком… {p}%','🎬 Speichern mit Wasserzeichen… {p}%','🎬 ロゴ付きで保存中… {p}%','🎬 वॉटरमार्क के साथ सेव हो रहा है… {p}%'],
    ['🎵 Ajout du son…','🎵 Adding sound…','🎵 Añadiendo el sonido…','🎵 Adicionando o som…','🎵 جارٍ إضافة الصوت…','🎵 正在添加声音…','🎵 Добавление звука…','🎵 Ton wird hinzugefügt…','🎵 音声を追加中…','🎵 आवाज़ जोड़ी जा रही है…'],
    ['Enregistrement arrêté','Saving stopped','Guardado detenido','Salvamento interrompido','تم إيقاف الحفظ','已停止保存','Сохранение остановлено','Speichern gestoppt','保存を停止しました','सेव करना रोक दिया गया'],
    ['⚠️ Votre téléphone ne permet pas d’enregistrer la vidéo avec la marque.','⚠️ Your phone can’t save the video with the watermark.','⚠️ Tu teléfono no permite guardar el video con la marca.','⚠️ Seu celular não permite salvar o vídeo com a marca.','⚠️ هاتفك لا يدعم حفظ الفيديو مع العلامة.','⚠️ 你的手机不支持保存带水印的视频。','⚠️ Ваш телефон не может сохранить видео с водяным знаком.','⚠️ Dein Handy kann das Video nicht mit Wasserzeichen speichern.','⚠️ お使いのスマホではロゴ付き動画を保存できません。','⚠️ आपका फ़ोन वॉटरमार्क के साथ वीडियो सेव नहीं कर सकता।'],
    ['⚠️ Enregistrement impossible pour le moment : le stockage bloque encore la marque (réglage à faire).','⚠️ Can’t save for now: storage still blocks the watermark (setting needed).','⚠️ No se puede guardar por ahora: el almacenamiento aún bloquea la marca (falta un ajuste).','⚠️ Não é possível salvar agora: o armazenamento ainda bloqueia a marca (ajuste necessário).','⚠️ تعذّر الحفظ حاليًا: التخزين يمنع العلامة (يلزم ضبط).','⚠️ 暂时无法保存：存储仍阻止添加水印（需要设置）。','⚠️ Пока нельзя сохранить: хранилище блокирует водяной знак (нужна настройка).','⚠️ Speichern gerade nicht möglich: Der Speicher blockiert noch das Wasserzeichen (Einstellung nötig).','⚠️ 現在保存できません：ストレージがロゴの追加をブロックしています（設定が必要）。','⚠️ अभी सेव नहीं हो सकता: स्टोरेज वॉटरमार्क रोक रहा है (सेटिंग ज़रूरी)।'],
    ['⚠️ Enregistrement impossible, réessayez.','⚠️ Couldn’t save, try again.','⚠️ No se pudo guardar, inténtalo de nuevo.','⚠️ Não foi possível salvar, tente novamente.','⚠️ تعذّر الحفظ، أعد المحاولة.','⚠️ 保存失败，请重试。','⚠️ Не удалось сохранить, попробуйте снова.','⚠️ Speichern fehlgeschlagen, versuch es erneut.','⚠️ 保存できませんでした。もう一度お試しください。','⚠️ सेव नहीं हो सका, फिर कोशिश करें।'],
    /* ── Statuts (statut_v1.html) ── */
    ['Statuts','Status','Estados','Status','الحالات','状态','Статусы','Status','ステータス','स्टेटस'],
    ['+ Ajouter','+ Add','+ Añadir','+ Adicionar','+ إضافة','+ 添加','+ Добавить','+ Hinzufügen','+ 追加','+ जोड़ें'],
    ['Mon statut','My status','Mi estado','Meu status','حالتي','我的状态','Мой статус','Mein Status','マイステータス','मेरा स्टेटस'],
    ['Récents','Recent','Recientes','Recentes','الأحدث','最近','Недавние','Neueste','最近','हाल के'],
    ['⏳ Chargement des statuts…','⏳ Loading statuses…','⏳ Cargando estados…','⏳ Carregando status…','⏳ جارٍ تحميل الحالات…','⏳ 正在加载状态…','⏳ Загрузка статусов…','⏳ Status werden geladen…','⏳ ステータスを読み込み中…','⏳ स्टेटस लोड हो रहे हैं…'],
    ['Stickers ArtiRoyce','ArtiRoyce stickers','Stickers ArtiRoyce','Figurinhas ArtiRoyce','ملصقات ArtiRoyce','ArtiRoyce 贴纸','Стикеры ArtiRoyce','ArtiRoyce-Sticker','ArtiRoyce ステッカー','ArtiRoyce स्टिकर'],
    ['Photo ajoutée','Photo added','Foto añadida','Foto adicionada','تمت إضافة الصورة','已添加照片','Фото добавлено','Foto hinzugefügt','写真を追加しました','फ़ोटो जुड़ गई'],
    ['Répondre…','Reply…','Responder…','Responder…','رد…','回复…','Ответить…','Antworten…','返信…','जवाब दें…'],
    ['📢 Créer un statut','📢 Create a status','📢 Crear un estado','📢 Criar um status','📢 إنشاء حالة','📢 发布状态','📢 Создать статус','📢 Status erstellen','📢 ステータスを作成','📢 स्टेटस बनाएँ'],
    ['Photo','Photo','Foto','Foto','صورة','照片','Фото','Foto','写真','फ़ोटो'],
    ['Vidéo','Video','Video','Vídeo','فيديو','视频','Видео','Video','動画','वीडियो'],
    ['Musique','Music','Música','Música','موسيقى','音乐','Музыка','Musik','音楽','संगीत'],
    ['Collage','Collage','Collage','Colagem','مجمّع صور','拼图','Коллаж','Collage','コラージュ','कोलाज'],
    ['← Retour','← Back','← Volver','← Voltar','← رجوع','← 返回','← Назад','← Zurück','← 戻る','← वापस'],
    ['🚀 Publier','🚀 Post','🚀 Publicar','🚀 Publicar','🚀 نشر','🚀 发布','🚀 Опубликовать','🚀 Posten','🚀 投稿','🚀 पोस्ट करें'],
    ['🎵 Musique','🎵 Music','🎵 Música','🎵 Música','🎵 موسيقى','🎵 音乐','🎵 Музыка','🎵 Musik','🎵 音楽','🎵 संगीत'],
    ['Chercher artiste, chanson…','Search artist, song…','Buscar artista, canción…','Pesquisar artista, música…','ابحث عن فنان أو أغنية…','搜索歌手、歌曲…','Искать исполнителя, песню…','Künstler, Song suchen…','アーティスト・曲を検索…','कलाकार, गाना खोजें…'],
    ['Chercher','Search','Buscar','Pesquisar','بحث','搜索','Искать','Suchen','検索','खोजें'],
    ['🌍 Cherche parmi des millions de titres','🌍 Search among millions of songs','🌍 Busca entre millones de canciones','🌍 Pesquise entre milhões de músicas','🌍 ابحث بين ملايين الأغاني','🌍 在数百万首歌曲中搜索','🌍 Ищите среди миллионов треков','🌍 Suche unter Millionen von Titeln','🌍 数百万曲から検索','🌍 लाखों गानों में खोजें'],
    ['ou 🎼 choisis depuis ta galerie','or 🎼 pick from your gallery','o 🎼 elige de tu galería','ou 🎼 escolha da sua galeria','أو 🎼 اختر من معرضك','或 🎼 从图库选择','или 🎼 выберите из галереи','oder 🎼 aus deiner Galerie wählen','または 🎼 ギャラリーから選択','या 🎼 अपनी गैलरी से चुनें'],
    ['✂️ Choisir le moment','✂️ Choose the part','✂️ Elige el momento','✂️ Escolha o trecho','✂️ اختر المقطع','✂️ 选择片段','✂️ Выберите фрагмент','✂️ Ausschnitt wählen','✂️ 部分を選択','✂️ हिस्सा चुनें'],
    ['✅ Attacher au statut','✅ Attach to status','✅ Añadir al estado','✅ Anexar ao status','✅ إرفاق بالحالة','✅ 添加到状态','✅ Прикрепить к статусу','✅ An Status anhängen','✅ ステータスに追加','✅ स्टेटस में जोड़ें'],
    ['📊 Statistiques du statut','📊 Status statistics','📊 Estadísticas del estado','📊 Estatísticas do status','📊 إحصاءات الحالة','📊 状态统计','📊 Статистика статуса','📊 Status-Statistik','📊 ステータスの統計','📊 स्टेटस के आँकड़े'],
    ['vue(s)','view(s)','vista(s)','visualização(ões)','مشاهدة','次浏览','просмотр(ов)','Aufruf(e)','回表示','व्यू'],
    ['Réactions','Reactions','Reacciones','Reações','التفاعلات','回应','Реакции','Reaktionen','リアクション','प्रतिक्रियाएँ'],
    ['⏱️ Vitesse de défilement','⏱️ Scroll speed','⏱️ Velocidad de avance','⏱️ Velocidade de rolagem','⏱️ سرعة التمرير','⏱️ 播放速度','⏱️ Скорость прокрутки','⏱️ Abspielgeschwindigkeit','⏱️ 再生スピード','⏱️ आगे बढ़ने की गति'],
    ['5 secondes','5 seconds','5 segundos','5 segundos','5 ثوانٍ','5 秒','5 секунд','5 Sekunden','5 秒','5 सेकंड'],
    ['11 secondes (par défaut)','11 seconds (default)','11 segundos (predeterminado)','11 segundos (padrão)','11 ثانية (افتراضي)','11 秒（默认）','11 секунд (по умолчанию)','11 Sekunden (Standard)','11 秒（標準）','11 सेकंड (डिफ़ॉल्ट)'],
    ['20 secondes','20 seconds','20 segundos','20 segundos','20 ثانية','20 秒','20 секунд','20 Sekunden','20 秒','20 सेकंड'],
    ['30 secondes','30 seconds','30 segundos','30 segundos','30 ثانية','30 秒','30 секунд','30 Sekunden','30 秒','30 सेकंड'],
    ['1 minute','1 minute','1 minuto','1 minuto','دقيقة واحدة','1 分钟','1 минута','1 Minute','1 分','1 मिनट'],
    ['⏸️ Pas de défilement automatique (je swipe moi-même)','⏸️ No auto-advance (I swipe myself)','⏸️ Sin avance automático (deslizo yo)','⏸️ Sem avanço automático (eu deslizo)','⏸️ بدون تقدّم تلقائي (أمرّر بنفسي)','⏸️ 不自动播放（我自己滑动）','⏸️ Без автопрокрутки (листаю сам)','⏸️ Kein automatisches Weiter (ich wische selbst)','⏸️ 自動で進めない（自分でスワイプ）','⏸️ अपने-आप आगे नहीं (मैं ख़ुद स्वाइप करूँगा)'],
    ['Qui peut voir ?','Who can see?','¿Quién puede verlo?','Quem pode ver?','من يمكنه الرؤية؟','谁可以查看？','Кто может видеть?','Wer darf es sehen?','誰が見られますか？','कौन देख सकता है?'],
    ['✅ Confirmer','✅ Confirm','✅ Confirmar','✅ Confirmar','✅ تأكيد','✅ 确认','✅ Подтвердить','✅ Bestätigen','✅ 確認','✅ पुष्टि करें'],
    ['{n} min','{n} min','{n} min','{n} min','{n} د','{n} 分钟','{n} мин','{n} Min.','{n}分','{n} मिनट'],
    ['{n} h','{n} h','{n} h','{n} h','{n} س','{n} 小时','{n} ч','{n} Std.','{n}時間','{n} घंटे'],
    ['{n} j','{n} d','{n} d','{n} d','{n} ي','{n} 天','{n} дн','{n} T.','{n}日','{n} दिन'],
    ['{n} nouveau','{n} new','{n} nuevo','{n} novo','{n} جديد','{n} 条新','{n} новый','{n} neu','新着 {n}','{n} नया'],
    ['{n} nouveaux','{n} new','{n} nuevos','{n} novos','{n} جديدة','{n} 条新','{n} новых','{n} neu','新着 {n}','{n} नए'],
    ['Vu','Seen','Visto','Visto','تمت المشاهدة','已看','Просмотрено','Gesehen','既読','देखा'],
    ['Visible par {n} abonné(e)(s) ✅','Visible to {n} follower(s) ✅','Visible para {n} seguidor(es) ✅','Visível para {n} seguidor(es) ✅','مرئي لـ {n} متابع ✅','{n} 位关注者可见 ✅','Видно {n} подписчик(ам) ✅','Sichtbar für {n} Follower ✅','フォロワー {n} 人に公開 ✅','{n} फ़ॉलोअर को दिखेगा ✅'],
    ['Statut visible par tout le monde ✅','Status visible to everyone ✅','Estado visible para todos ✅','Status visível para todos ✅','الحالة مرئية للجميع ✅','状态对所有人可见 ✅','Статус виден всем ✅','Status für alle sichtbar ✅','ステータスは全員に公開 ✅','स्टेटस सबको दिखेगा ✅'],
    ['Statut visible par tout le monde','Status visible to everyone','Estado visible para todos','Status visível para todos','الحالة مرئية للجميع','状态对所有人可见','Статус виден всем','Status für alle sichtbar','ステータスは全員に公開','स्टेटस सबको दिखेगा'],
    ['{s} envoyé !','{s} sent!','¡{s} enviado!','{s} enviado!','تم إرسال {s}!','{s} 已发送！','{s} отправлено!','{s} gesendet!','{s} を送信しました！','{s} भेज दिया!'],
    ['⚠️ Envoi impossible (connexion)','⚠️ Couldn’t send (connection)','⚠️ No se pudo enviar (conexión)','⚠️ Não foi possível enviar (conexão)','⚠️ تعذّر الإرسال (الاتصال)','⚠️ 发送失败（网络）','⚠️ Не удалось отправить (связь)','⚠️ Senden fehlgeschlagen (Verbindung)','⚠️ 送信できません（接続）','⚠️ भेजा नहीं जा सका (कनेक्शन)'],
    ['🎵 « {t} » attaché !','🎵 “{t}” attached!','🎵 ¡«{t}» añadido!','🎵 “{t}” anexado!','🎵 تم إرفاق «{t}»!','🎵 已添加「{t}」！','🎵 «{t}» прикреплено!','🎵 „{t}“ angehängt!','🎵 「{t}」を追加しました！','🎵 “{t}” जोड़ दिया!'],
    ['🎼 « {t} » chargé depuis la galerie','🎼 “{t}” loaded from gallery','🎼 «{t}» cargado desde la galería','🎼 “{t}” carregado da galeria','🎼 تم تحميل «{t}» من المعرض','🎼 已从图库载入「{t}」','🎼 «{t}» загружено из галереи','🎼 „{t}“ aus der Galerie geladen','🎼 ギャラリーから「{t}」を読み込みました','🎼 “{t}” गैलरी से लोड हुआ'],
    ['Choisir qui voit','Choose who sees','Elegir quién lo ve','Escolher quem vê','اختر من يرى','选择谁可见','Выбрать, кто видит','Wählen, wer es sieht','見られる人を選ぶ','कौन देखे चुनें'],
    ['Masquer','Hide','Ocultar','Ocultar','إخفاء','隐藏','Скрыть','Ausblenden','非表示','छिपाएँ'],
    ['Supprimer tous tes statuts actifs ?','Delete all your active statuses?','¿Eliminar todos tus estados activos?','Excluir todos os seus status ativos?','حذف كل حالاتك النشطة؟','删除你所有正在显示的状态？','Удалить все ваши активные статусы?','Alle deine aktiven Status löschen?','公開中のステータスをすべて削除しますか？','अपने सभी सक्रिय स्टेटस हटाएँ?'],
    ['Options','Options','Opciones','Opções','الخيارات','选项','Параметры','Optionen','オプション','विकल्प'],
    ['Choisir qui peut voir','Choose who can see','Elegir quién puede verlo','Escolher quem pode ver','اختر من يمكنه الرؤية','选择谁可以查看','Выбрать, кто может видеть','Wählen, wer es sehen darf','見られる人を選ぶ','कौन देख सकता है चुनें'],
    ['Masquer ce statut','Hide this status','Ocultar este estado','Ocultar este status','إخفاء هذه الحالة','隐藏此状态','Скрыть этот статус','Diesen Status ausblenden','このステータスを非表示','यह स्टेटस छिपाएँ'],
    ['Télécharger','Download','Descargar','Baixar','تنزيل','下载','Скачать','Herunterladen','ダウンロード','डाउनलोड करें'],
    ['Vitesse de défilement','Scroll speed','Velocidad de avance','Velocidade de rolagem','سرعة التمرير','播放速度','Скорость прокрутки','Abspielgeschwindigkeit','再生スピード','आगे बढ़ने की गति'],
    ['📷 Photo','📷 Photo','📷 Foto','📷 Foto','📷 صورة','📷 照片','📷 Фото','📷 Foto','📷 写真','📷 फ़ोटो'],
    ['🎥 Vidéo','🎥 Video','🎥 Video','🎥 Vídeo','🎥 فيديو','🎥 视频','🎥 Видео','🎥 Video','🎥 動画','🎥 वीडियो'],
    ['✍️ Texte','✍️ Text','✍️ Texto','✍️ Texto','✍️ نص','✍️ 文字','✍️ Текст','✍️ Text','✍️ テキスト','✍️ टेक्स्ट'],
    ['🖼️ Collage','🖼️ Collage','🖼️ Collage','🖼️ Colagem','🖼️ مجمّع صور','🖼️ 拼图','🖼️ Коллаж','🖼️ Collage','🖼️ コラージュ','🖼️ कोलाज'],
    ['🎤 Audio','🎤 Audio','🎤 Audio','🎤 Áudio','🎤 صوت','🎤 音频','🎤 Аудио','🎤 Audio','🎤 音声','🎤 ऑडियो'],
    ['Éditeur','Editor','Editor','Editor','المحرر','编辑','Редактор','Editor','エディター','एडिटर'],
    ['Toucher pour choisir une photo','Tap to choose a photo','Toca para elegir una foto','Toque para escolher uma foto','اضغط لاختيار صورة','点击选择照片','Нажмите, чтобы выбрать фото','Tippen, um ein Foto zu wählen','タップして写真を選択','फ़ोटो चुनने के लिए टैप करें'],
    ['Toucher pour choisir une vidéo','Tap to choose a video','Toca para elegir un video','Toque para escolher um vídeo','اضغط لاختيار فيديو','点击选择视频','Нажмите, чтобы выбрать видео','Tippen, um ein Video zu wählen','タップして動画を選択','वीडियो चुनने के लिए टैप करें'],
    ['Changer','Change','Cambiar','Trocar','تغيير','更换','Изменить','Ändern','変更','बदलें'],
    ['Écris ton message…','Write your message…','Escribe tu mensaje…','Escreva sua mensagem…','اكتب رسالتك…','写下你的内容…','Напишите сообщение…','Schreib deine Nachricht…','メッセージを入力…','अपना संदेश लिखें…'],
    ['📷 Ajouter photos (max 4)','📷 Add photos (max 4)','📷 Añadir fotos (máx. 4)','📷 Adicionar fotos (máx. 4)','📷 أضف صورًا (4 كحد أقصى)','📷 添加照片（最多 4 张）','📷 Добавить фото (макс. 4)','📷 Fotos hinzufügen (max. 4)','📷 写真を追加（最大 4 枚）','📷 फ़ोटो जोड़ें (अधिकतम 4)'],
    ['Appuie pour enregistrer','Tap to record','Toca para grabar','Toque para gravar','اضغط للتسجيل','点击录音','Нажмите, чтобы записать','Tippen zum Aufnehmen','タップして録音','रिकॉर्ड करने के लिए टैप करें'],
    ['Ajouter une musique','Add music','Añadir música','Adicionar música','أضف موسيقى','添加音乐','Добавить музыку','Musik hinzufügen','音楽を追加','संगीत जोड़ें'],
    ['Chercher ou galerie','Search or gallery','Buscar o galería','Pesquisar ou galeria','بحث أو المعرض','搜索或图库','Поиск или галерея','Suche oder Galerie','検索またはギャラリー','खोजें या गैलरी'],
    ['Connecte-toi pour publier','Log in to post','Inicia sesión para publicar','Entre para publicar','سجّل الدخول للنشر','登录后即可发布','Войдите, чтобы публиковать','Melde dich an, um zu posten','投稿するにはログイン','पोस्ट करने के लिए लॉग इन करें'],
    ['Statut masqué','Status hidden','Estado oculto','Status ocultado','تم إخفاء الحالة','已隐藏状态','Статус скрыт','Status ausgeblendet','ステータスを非表示にしました','स्टेटस छिपा दिया गया'],
    ['Statut supprimé','Status deleted','Estado eliminado','Status excluído','تم حذف الحالة','已删除状态','Статус удалён','Status gelöscht','ステータスを削除しました','स्टेटस हटा दिया गया'],
    ["Sélectionne d'abord une chanson",'Select a song first','Primero selecciona una canción','Selecione uma música primeiro','اختر أغنية أولًا','请先选择一首歌','Сначала выберите песню','Wähle zuerst einen Song','先に曲を選んでください','पहले एक गाना चुनें'],
    ['Sélectionne une chanson','Select a song','Selecciona una canción','Selecione uma música','اختر أغنية','请选择一首歌','Выберите песню','Wähle einen Song','曲を選んでください','एक गाना चुनें'],
    ['⏳ Compression de la vidéo en cours, patiente un instant…','⏳ Compressing the video, please wait…','⏳ Comprimiendo el video, espera un momento…','⏳ Comprimindo o vídeo, aguarde um instante…','⏳ جارٍ ضغط الفيديو، انتظر قليلًا…','⏳ 正在压缩视频，请稍候…','⏳ Сжатие видео, подождите…','⏳ Video wird komprimiert, einen Moment…','⏳ 動画を圧縮中です。少々お待ちください…','⏳ वीडियो कंप्रेस हो रहा है, थोड़ा रुकें…'],
    ['⚠️ Ajoute au moins une photo','⚠️ Add at least one photo','⚠️ Añade al menos una foto','⚠️ Adicione pelo menos uma foto','⚠️ أضف صورة واحدة على الأقل','⚠️ 请至少添加一张照片','⚠️ Добавьте хотя бы одно фото','⚠️ Füge mindestens ein Foto hinzu','⚠️ 写真を1枚以上追加してください','⚠️ कम से कम एक फ़ोटो जोड़ें'],
    ["⚠️ Choisis une photo d'abord",'⚠️ Choose a photo first','⚠️ Primero elige una foto','⚠️ Escolha uma foto primeiro','⚠️ اختر صورة أولًا','⚠️ 请先选择照片','⚠️ Сначала выберите фото','⚠️ Wähle zuerst ein Foto','⚠️ 先に写真を選んでください','⚠️ पहले एक फ़ोटो चुनें'],
    ["⚠️ Choisis une vidéo d'abord",'⚠️ Choose a video first','⚠️ Primero elige un video','⚠️ Escolha um vídeo primeiro','⚠️ اختر فيديو أولًا','⚠️ 请先选择视频','⚠️ Сначала выберите видео','⚠️ Wähle zuerst ein Video','⚠️ 先に動画を選んでください','⚠️ पहले एक वीडियो चुनें'],
    ['⚠️ Contenu trop volumineux, réessaie avec moins de photos ou une photo plus légère','⚠️ Content too large, try fewer or lighter photos','⚠️ Contenido demasiado pesado, prueba con menos fotos o más ligeras','⚠️ Conteúdo muito pesado, tente com menos fotos ou mais leves','⚠️ المحتوى كبير جدًا، جرّب صورًا أقل أو أخف','⚠️ 内容过大，请减少照片或换更小的照片','⚠️ Слишком большой объём, попробуйте меньше фото или полегче','⚠️ Zu groß, versuch es mit weniger oder kleineren Fotos','⚠️ 容量が大きすぎます。写真を減らすか軽い写真でお試しください','⚠️ सामग्री बहुत बड़ी है, कम या हल्की फ़ोटो आज़माएँ'],
    ['⚠️ Enregistrement impossible (connexion)','⚠️ Couldn’t save (connection)','⚠️ No se pudo guardar (conexión)','⚠️ Não foi possível salvar (conexão)','⚠️ تعذّر الحفظ (الاتصال)','⚠️ 保存失败（网络）','⚠️ Не удалось сохранить (связь)','⚠️ Speichern fehlgeschlagen (Verbindung)','⚠️ 保存できません（接続）','⚠️ सेव नहीं हो सका (कनेक्शन)'],
    ['⚠️ Photo invalide, réessaie','⚠️ Invalid photo, try again','⚠️ Foto no válida, inténtalo de nuevo','⚠️ Foto inválida, tente novamente','⚠️ صورة غير صالحة، أعد المحاولة','⚠️ 照片无效，请重试','⚠️ Неверное фото, попробуйте снова','⚠️ Ungültiges Foto, versuch es erneut','⚠️ 無効な写真です。もう一度お試しください','⚠️ फ़ोटो सही नहीं है, फिर कोशिश करें'],
    ["⚠️ Une photo du collage n'a pas pu être traitée",'⚠️ One collage photo couldn’t be processed','⚠️ No se pudo procesar una foto del collage','⚠️ Uma foto da colagem não pôde ser processada','⚠️ تعذّرت معالجة إحدى صور المجمّع','⚠️ 有一张拼图照片无法处理','⚠️ Не удалось обработать одно фото коллажа','⚠️ Ein Collage-Foto konnte nicht verarbeitet werden','⚠️ コラージュの写真を1枚処理できませんでした','⚠️ कोलाज की एक फ़ोटो प्रोसेस नहीं हो सकी'],
    ['📷 Photo + message envoyés !','📷 Photo + message sent!','📷 ¡Foto + mensaje enviados!','📷 Foto + mensagem enviadas!','📷 تم إرسال الصورة والرسالة!','📷 照片和消息已发送！','📷 Фото и сообщение отправлены!','📷 Foto + Nachricht gesendet!','📷 写真とメッセージを送信しました！','📷 फ़ोटो + संदेश भेज दिए!'],
    ['✅ Réponse envoyée !','✅ Reply sent!','✅ ¡Respuesta enviada!','✅ Resposta enviada!','✅ تم إرسال الرد!','✅ 回复已发送！','✅ Ответ отправлен!','✅ Antwort gesendet!','✅ 返信しました！','✅ जवाब भेज दिया!'],
    ['📷 Photo publiée !','📷 Photo posted!','📷 ¡Foto publicada!','📷 Foto publicada!','📷 تم نشر الصورة!','📷 照片已发布！','📷 Фото опубликовано!','📷 Foto gepostet!','📷 写真を投稿しました！','📷 फ़ोटो पोस्ट हो गई!'],
    ['🎥 Vidéo publiée !','🎥 Video posted!','🎥 ¡Video publicado!','🎥 Vídeo publicado!','🎥 تم نشر الفيديو!','🎥 视频已发布！','🎥 Видео опубликовано!','🎥 Video gepostet!','🎥 動画を投稿しました！','🎥 वीडियो पोस्ट हो गया!'],
    ['✍️ Texte publié !','✍️ Text posted!','✍️ ¡Texto publicado!','✍️ Texto publicado!','✍️ تم نشر النص!','✍️ 文字已发布！','✍️ Текст опубликован!','✍️ Text gepostet!','✍️ テキストを投稿しました！','✍️ टेक्स्ट पोस्ट हो गया!'],
    ['🖼️ Collage publié !','🖼️ Collage posted!','🖼️ ¡Collage publicado!','🖼️ Colagem publicada!','🖼️ تم نشر المجمّع!','🖼️ 拼图已发布！','🖼️ Коллаж опубликован!','🖼️ Collage gepostet!','🖼️ コラージュを投稿しました！','🖼️ कोलाज पोस्ट हो गया!'],
    ['🎤 Audio publié !','🎤 Audio posted!','🎤 ¡Audio publicado!','🎤 Áudio publicado!','🎤 تم نشر الصوت!','🎤 音频已发布！','🎤 Аудио опубликовано!','🎤 Audio gepostet!','🎤 音声を投稿しました！','🎤 ऑडियो पोस्ट हो गया!'],
    ['Erreur lors de la publication','Error while posting','Error al publicar','Erro ao publicar','خطأ أثناء النشر','发布时出错','Ошибка при публикации','Fehler beim Posten','投稿中にエラーが発生しました','पोस्ट करते समय त्रुटि'],
    /* ── Statuts : cercle, vues, réponses (statut_v1.html + discussion_v1.html) ── */
    ['Choisissez un cercle','Choose a circle','Elige un círculo','Escolha um círculo','اختر دائرة','选择可见范围','Выберите круг','Wähle einen Kreis','公開範囲を選択','एक दायरा चुनें'],
    ['Tout le monde','Everyone','Todos','Todos','الجميع','所有人','Все','Alle','全員','सभी'],
    ['Tout le monde sauf…','Everyone except…','Todos excepto…','Todos, exceto…','الجميع باستثناء…','所有人，除了…','Все, кроме…','Alle außer…','次の人以外の全員…','सभी, सिवाय…'],
    ["Ne partager qu'avec…",'Only share with…','Compartir solo con…','Compartilhar só com…','المشاركة فقط مع…','仅分享给…','Делиться только с…','Nur teilen mit…','次の人とだけ共有…','सिर्फ़ इनके साथ शेयर करें…'],
    ['✅ Enregistrer','✅ Save','✅ Guardar','✅ Salvar','✅ حفظ','✅ 保存','✅ Сохранить','✅ Speichern','✅ 保存','✅ सेव करें'],
    ['Modifier ›','Change ›','Cambiar ›','Alterar ›','تغيير ›','修改 ›','Изменить ›','Ändern ›','変更 ›','बदलें ›'],
    ['Visible par :','Visible to:','Visible para:','Visível para:','مرئي لـ:','可见范围：','Видно:','Sichtbar für:','公開範囲：','किसे दिखेगा:'],
    ['✅ Visible par :','✅ Visible to:','✅ Visible para:','✅ Visível para:','✅ مرئي لـ:','✅ 可见范围：','✅ Видно:','✅ Sichtbar für:','✅ 公開範囲：','✅ किसे दिखेगा:'],
    ['Tout le monde sauf {n}','Everyone except {n}','Todos excepto {n}','Todos, exceto {n}','الجميع باستثناء {n}','所有人，除了 {n} 人','Все, кроме {n}','Alle außer {n}','{n} 人以外の全員','सभी, सिवाय {n}'],
    ['Seulement {n} personne(s)','Only {n} person(s)','Solo {n} persona(s)','Só {n} pessoa(s)','{n} شخص فقط','仅 {n} 人','Только {n} чел.','Nur {n} Person(en)','{n} 人のみ','सिर्फ़ {n} लोग'],
    ['{n} exclu(s) · Modifier ›','{n} excluded · Change ›','{n} excluido(s) · Cambiar ›','{n} excluído(s) · Alterar ›','{n} مستبعد · تغيير ›','已排除 {n} 人 · 修改 ›','Исключено: {n} · Изменить ›','{n} ausgeschlossen · Ändern ›','{n} 人を除外 · 変更 ›','{n} बाहर · बदलें ›'],
    ['{n} inclus · Modifier ›','{n} included · Change ›','{n} incluido(s) · Cambiar ›','{n} incluído(s) · Alterar ›','{n} مشمول · تغيير ›','已包含 {n} 人 · 修改 ›','Включено: {n} · Изменить ›','{n} ausgewählt · Ändern ›','{n} 人を選択 · 変更 ›','{n} शामिल · बदलें ›'],
    ['Masquer le statut pour…','Hide status from…','Ocultar el estado a…','Ocultar o status de…','إخفاء الحالة عن…','对以下人隐藏状态…','Скрыть статус от…','Status ausblenden für…','次の人にステータスを非表示…','इनसे स्टेटस छिपाएँ…'],
    ['Partager le statut avec…','Share status with…','Compartir el estado con…','Compartilhar o status com…','مشاركة الحالة مع…','将状态分享给…','Поделиться статусом с…','Status teilen mit…','ステータスを共有する相手…','इनके साथ स्टेटस शेयर करें…'],
    ['Rechercher un nom…','Search a name…','Buscar un nombre…','Pesquisar um nome…','ابحث عن اسم…','搜索姓名…','Найти имя…','Namen suchen…','名前で検索…','नाम खोजें…'],
    ['Aucun abonné ni discussion pour l’instant.','No followers or chats yet.','Aún no hay seguidores ni chats.','Ainda não há seguidores nem conversas.','لا يوجد متابعون أو محادثات بعد.','暂无关注者或聊天。','Пока нет подписчиков и чатов.','Noch keine Follower oder Chats.','まだフォロワーもチャットもありません。','अभी कोई फ़ॉलोअर या चैट नहीं है।'],
    ['Utilisateur','User','Usuario','Usuário','مستخدم','用户','Пользователь','Nutzer','ユーザー','उपयोगकर्ता'],
    ['Vu par','Seen by','Visto por','Visto por','شاهده','查看者','Просмотрели','Gesehen von','閲覧した人','किसने देखा'],
    ['a réagi','reacted','reaccionó','reagiu','تفاعل','已回应','отреагировал(а)','hat reagiert','リアクション','प्रतिक्रिया दी'],
    ['Personne n’a encore vu ce statut','No one has seen this status yet','Nadie ha visto este estado todavía','Ninguém viu este status ainda','لم يشاهد أحد هذه الحالة بعد','还没有人看过这条状态','Этот статус ещё никто не видел','Noch niemand hat diesen Status gesehen','まだ誰もこのステータスを見ていません','अभी तक किसी ने यह स्टेटस नहीं देखा'],
    ['A réagi à votre statut','Reacted to your status','Reaccionó a tu estado','Reagiu ao seu status','تفاعل مع حالتك','回应了你的状态','Отреагировал(а) на ваш статус','Hat auf deinen Status reagiert','あなたのステータスにリアクション','आपके स्टेटस पर प्रतिक्रिया दी'],
    ['A répondu à votre statut','Replied to your status','Respondió a tu estado','Respondeu ao seu status','رد على حالتك','回复了你的状态','Ответил(а) на ваш статус','Hat auf deinen Status geantwortet','あなたのステータスに返信','आपके स्टेटस का जवाब दिया'],
    ['Vous avez réagi à son statut','You reacted to their status','Reaccionaste a su estado','Você reagiu ao status','لقد تفاعلت مع حالته','你回应了 TA 的状态','Вы отреагировали на статус','Du hast auf den Status reagiert','ステータスにリアクションしました','आपने उनके स्टेटस पर प्रतिक्रिया दी'],
    ['Vous avez répondu à son statut','You replied to their status','Respondiste a su estado','Você respondeu ao status','لقد رددت على حالته','你回复了 TA 的状态','Вы ответили на статус','Du hast auf den Status geantwortet','ステータスに返信しました','आपने उनके स्टेटस का जवाब दिया'],
    ['Voir ›','View ›','Ver ›','Ver ›','عرض ›','查看 ›','Открыть ›','Ansehen ›','見る ›','देखें ›'],
    ['Ce statut n’est plus disponible (24 h passées)','This status is no longer available (24 h passed)','Este estado ya no está disponible (pasaron 24 h)','Este status não está mais disponível (24 h se passaram)','هذه الحالة لم تعد متاحة (مرّت 24 ساعة)','此状态已不可用（已超过 24 小时）','Этот статус больше недоступен (прошло 24 ч)','Dieser Status ist nicht mehr verfügbar (24 Std. vorbei)','このステータスは表示できません（24時間経過）','यह स्टेटस अब उपलब्ध नहीं है (24 घंटे बीत गए)'],
    /* Métiers de la recherche */
    ['Coiffeur / Coiffeuse','Hairdresser','Peluquero / Peluquera','Cabeleireiro / Cabeleireira','حلاق / مصففة شعر','理发师','Парикмахер','Friseur / Friseurin','美容師','हेयरड्रेसर'],
    ['Maquilleur / Maquilleuse','Makeup artist','Maquillador / Maquilladora','Maquiador / Maquiadora','خبير / خبيرة تجميل','化妆师','Визажист','Visagist / Visagistin','メイクアップアーティスト','मेकअप आर्टिस्ट'],
    ['Photographe','Photographer','Fotógrafo','Fotógrafo','مصوّر','摄影师','Фотограф','Fotograf','写真家','फ़ोटोग्राफ़र'],
    ['Vidéaste','Videographer','Videógrafo','Videomaker','مصوّر فيديو','摄像师','Видеограф','Videograf','映像クリエイター','वीडियोग्राफ़र'],
    ['Traiteur / Traiteure','Caterer','Servicio de catering','Bufê','متعهد طعام','餐饮服务','Кейтеринг','Caterer','ケータリング','कैटरर'],
    ['Chanteur / Chanteuse','Singer','Cantante','Cantor / Cantora','مغنٍّ / مغنية','歌手','Певец / Певица','Sänger / Sängerin','歌手','गायक / गायिका'],
    ['Musicien / Musicienne','Musician','Músico / Música','Músico / Musicista','موسيقي / موسيقية','音乐人','Музыкант','Musiker / Musikerin','ミュージシャン','संगीतकार'],
    ['Danseur / Danseuse','Dancer','Bailarín / Bailarina','Dançarino / Dançarina','راقص / راقصة','舞者','Танцор / Танцовщица','Tänzer / Tänzerin','ダンサー','डांसर'],
    ['Artiste peintre','Painter (artist)','Artista pintor','Artista pintor','رسّام فنان','画家','Художник','Kunstmaler','画家','चित्रकार'],
    ['Décorateur / Décoratrice','Decorator','Decorador / Decoradora','Decorador / Decoradora','مصمم / مصممة ديكور','装饰师','Декоратор','Dekorateur / Dekorateurin','デコレーター','डेकोरेटर'],
    ['Styliste / Couturier','Fashion designer / Tailor','Estilista / Modista','Estilista / Costureiro','مصمم أزياء / خياط','服装设计师 / 裁缝','Стилист / Портной','Designer / Schneider','スタイリスト / 仕立て屋','फ़ैशन डिज़ाइनर / दर्ज़ी'],
    ['Animateur / Animatrice','Host / Entertainer','Animador / Animadora','Animador / Animadora','منشّط / منشّطة','主持人','Ведущий / Ведущая','Moderator / Moderatorin','司会者','होस्ट / एंटरटेनर'],
    ['Artisan','Craftsperson','Artesano','Artesão','حِرَفي','手艺人','Ремесленник','Handwerker','職人','कारीगर'],
    ['Opérateur économique','Business operator','Operador económico','Operador econômico','فاعل اقتصادي','经营者','Предприниматель','Wirtschaftsakteur','事業者','व्यवसायी'],
    ['Comédien / Comédienne','Actor / Actress','Actor / Actriz','Ator / Atriz','ممثل / ممثلة','演员','Актёр / Актриса','Schauspieler / Schauspielerin','俳優','अभिनेता / अभिनेत्री'],
    ['Influenceur / Influenceuse','Influencer','Influencer','Influenciador / Influenciadora','مؤثّر / مؤثّرة','网红','Блогер','Influencer / Influencerin','インフルエンサー','इन्फ़्लुएंसर'],
    ['Podcasteur','Podcaster','Podcaster','Podcaster','صانع بودكاست','播客主','Подкастер','Podcaster','ポッドキャスター','पॉडकास्टर']
  ];

  /* ── Rangement (ne pas modifier) ── */
  var TABLE = {};                      // TABLE[langue][texte français] = traduction
  LANGUES.forEach(function (L, i) {
    TABLE[L] = {};
    PHRASES.forEach(function (ligne) { if (ligne[i + 1]) TABLE[L][ligne[0]] = ligne[i + 1]; });
  });

  function langue() {
    try { if (typeof currentLang !== 'undefined' && currentLang) return currentLang; } catch (e) {}
    try { return localStorage.getItem('ar_lang') || 'FR'; } catch (e) { return 'FR'; }
  }

  // Texte français → texte dans la langue choisie (le français si rien n'est trouvé).
  window.trApp = function (fr, vals) {
    var L = langue();
    var t = (L !== 'FR' && TABLE[L] && TABLE[L][fr]) || fr;
    if (vals) for (var k in vals) t = t.split('{' + k + '}').join(vals[k]);
    return t;
  };

  // Ajoute les textes data-i18n aux traductions existantes (sans rien effacer).
  if (typeof TRANSLATIONS !== 'undefined') {
    for (var L in CLES) {
      TRANSLATIONS[L] = TRANSLATIONS[L] || {};
      for (var k in CLES[L]) if (TRANSLATIONS[L][k] === undefined) TRANSLATIONS[L][k] = CLES[L][k];
    }
  }

  // Textes fixes de la page marqués data-tr="…" (texte) ou data-tr-ph="…" (champ de saisie).
  function traduirePage() {
    document.querySelectorAll('[data-tr]').forEach(function (el) { el.textContent = window.trApp(el.getAttribute('data-tr')); });
    document.querySelectorAll('[data-tr-ph]').forEach(function (el) { el.placeholder = window.trApp(el.getAttribute('data-tr-ph')); });
  }
  if (typeof window.applyTranslations === 'function') {
    var origine = window.applyTranslations;
    window.applyTranslations = function (l) { origine(l); traduirePage(); };
  }
  // Langue choisie EXPRÈS dans l'application (bouton drapeau) : elle passe avant la
  // langue du téléphone. (translations.js remet sinon la langue du téléphone quand on choisit FR.)
  function langueChoisie() {
    var c = null;
    try { c = localStorage.getItem('ar_lang_choisi'); } catch (e) {}
    if (c && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[c] && typeof currentLang !== 'undefined'
        && c !== currentLang && typeof window.applyTranslations === 'function') window.applyTranslations(c);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', langueChoisie);
    document.addEventListener('DOMContentLoaded', traduirePage);
  } else { langueChoisie(); traduirePage(); }
})();
