use crate::db::CollectionName;
use crate::error::AppError;
use crate::impl_from_request;
use crate::middleware::auth::Sub;
use crate::Db;
use actix_web::dev::Payload;
use actix_web::{web::Data, FromRequest, HttpMessage, HttpRequest};
use bson::doc;
use futures_util::Future;
use serde::{Deserialize, Serialize};
use std::pin::Pin;

#[derive(Default, Clone, Debug, Deserialize, Serialize)]
pub struct Admin {
    #[serde(rename(serialize = "_id", deserialize = "_id"))]
    pub sub: String,
    pub institution: String,
    pub faculty: String,
}

impl CollectionName for Admin {
    fn collection_name() -> &'static str {
        "Admins"
    }
}

impl_from_request!(for Admin);
