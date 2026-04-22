create extension if not exists pg_net;
create extension if not exists pg_cron;
create extension if not exists vault;

select vault.create_secret('https://TU-PROYECTO.supabase.co', 'project_url')
where not exists (select 1 from vault.decrypted_secrets where name = 'project_url');

select vault.create_secret('TU_SUPABASE_ANON_KEY', 'anon_key')
where not exists (select 1 from vault.decrypted_secrets where name = 'anon_key');

select cron.schedule(
  'fonokids-weekly-summary',
  '0 18 * * 5',
  $$
  select
    net.http_post(
      url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/weekly-summary',
      headers:= jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
      ),
      body:= jsonb_build_object('trigger', 'cron', 'run_at', now())
    );
  $$
);
