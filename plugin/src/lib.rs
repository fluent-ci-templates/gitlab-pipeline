use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "install",
            &format!("gitlab.com/gitlab-org/cli@{}", version),
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn release_create(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+gitlab.com/gitlab-org/cli",
            "glab",
            "auth",
            "login",
            "--token",
            "$GITLAB_ACCESS_TOKEN",
        ])?
        .with_exec(vec![
            "pkgx",
            "+gitlab.com/gitlab-org/cli",
            "+git-scm.org",
            "glab",
            "release",
            "create",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn release_upload(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+gitlab.com/gitlab-org/cli",
            "glab",
            "auth",
            "login",
            "--token",
            "$GITLAB_ACCESS_TOKEN",
        ])?
        .with_exec(vec![
            "pkgx",
            "+gitlab.com/gitlab-org/cli",
            "+git-scm.org",
            "glab",
            "release",
            "upload",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}
