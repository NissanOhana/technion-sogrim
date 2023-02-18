use crate::config::CONFIG;
use actix_web::{web, App, HttpResponse, HttpServer};
use actix_web_lab::middleware::from_fn;
use db::Db;
use dotenvy::dotenv;
use error::AppError;
use middleware::auth;

mod api;
mod config;
mod core;
mod cors;
mod db;
mod error;
mod logger;
mod middleware;
mod resources;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load .env (in development environment)
    dotenv().ok();

    // Initialize logger
    logger::init_env_logger();

    // Initialize DB client
    let db = Db::new().await;

    // Start the server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .app_data(auth::JwtDecoder::new())
            .wrap(cors::cors())
            .wrap(logger::init_actix_logger())
            .service(web::resource("/healthcheck").route(web::get().to(
                |db: web::Data<Db>| async move {
                    db.ping().await?;
                    Result::<HttpResponse, AppError>::Ok(HttpResponse::Ok().finish())
                },
            )))
            .service(
                web::scope("")
                    .wrap(from_fn(auth::authenticate))
                    .service(api::students::get_catalogs)
                    .service(api::students::login)
                    .service(api::students::update_catalog)
                    .service(api::students::get_courses_by_filter)
                    .service(api::students::add_courses)
                    .service(api::students::compute_degree_status)
                    .service(api::students::update_details)
                    .service(api::students::update_settings)
                    .service(api::admins::parse_courses_and_compute_degree_status)
                    .service(api::bo::get_all_courses)
                    .service(api::bo::get_course_by_id)
                    .service(api::bo::create_or_update_course)
                    .service(api::bo::delete_course),
            )
    })
    .bind((CONFIG.ip, CONFIG.port))?
    .run()
    .await
}
