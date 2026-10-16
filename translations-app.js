/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — translations-app.js  (DEUXIÈME TRADUCTION : l'intérieur)
   ══════════════════════════════════════════════════════════════════════
   - translations.js (index + inscriptions) N'EST PAS modifié.
   - Ce fichier se charge JUSTE APRÈS translations.js et ajoute les textes
     de l'intérieur de l'application, dans les 10 langues.
   - La langue est la même partout (choix gardé dans "ar_lang").
   - Dans le code des pages : TR('Texte en français') donne le texte dans
     la langue choisie. Si une traduction manque : le français s'affiche.
   - Pages déjà faites : accueil.html
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
    ['Téléchargé sur ArtiRoyce','Uploaded on ArtiRoyce','Subido a ArtiRoyce','Enviado no ArtiRoyce','تم الرفع على ArtiRoyce','上传于 ArtiRoyce','Загружено в ArtiRoyce','Hochgeladen auf ArtiRoyce','ArtiRoyce に投稿','ArtiRoyce पर अपलोड किया गया'],
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
