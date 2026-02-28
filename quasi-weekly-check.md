





-----CHECK


1.workflows de github funcionen bien, y que el clone backup se haga bien en S3 AWS. los cron jobs.

2. navegar por la web viendo que todo funciona bien y no hay nada caido, y que funciona a velocidad bien normal

3.ver cuenta de revolut, cuanto me han sacao.
    ver google cloud console, y analytics para ver que tal y si todo bien.

4. SELECTS A REALIZAR:


        1. SELECT * FROM sessions where validated = false

        2. SELECT * FROM profiles ORDER BY created_at DESC

        3. SELECT * FROM user_suggestions ORDER BY created_at DESC

        4. SELECT * FROM likes ORDER BY created_at DESC

        5. SELECT * FROM jam_reports ORDER BY created_at DESC

        6.SELECT t3.email, t1.content, t2.jam_title, t2.location_title, t2.location_address, t1.created_at FROM comments t1 JOIN sessions t2 on t1.jam_id = t2.id JOIN profiles t3 ON t1.user_id = t3.id
            ORDER BY t1.created_at DESC

        7. SELECT 
                'REPORTED' as reporting,
                cr.created_at,          -- todo de comment_reports
                c.content,     -- contenido del comentario
                p.email        -- email del reportero
            FROM comment_reports cr
            JOIN comments c ON cr.comment_id = c.id
            JOIN profiles p ON cr.reporter_id = p.id
            ORDER BY cr.created_at DESC;

        