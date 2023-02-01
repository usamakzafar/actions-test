module.exports = async ({ github, context, core }) => {
    const REGEX = /^\[[a-zA-Z\d]{2,}-?\d*\]\s.+/
    const PR_TITLE = context.payload.pull_request.title

    const COMMENT_HEADER = "**Pull Request title does not follow the convention.**"
    const COMMENT_BODY = "Please prefix the title with a Jira ticket number/ team shortcut in brackets, for example:"
    const COMMENT_FOOTER = "[XYZ] PR title convention\n[XYZ1-123] PR title convention"

    const body = `${COMMENT_HEADER} \n${COMMENT_BODY} \n${COMMENT_FOOTER}`

    const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    })

    const currentComment = comments.find(comment => comment.body.startsWith(COMMENT_HEADER))

    if (!REGEX.exec(PR_TITLE)) {
        if (currentComment) {
            github.rest.issues.updateComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: currentComment.id,
                body: body
            })
        } else {
            github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
            })
        }
        core.setFailed('Pull Request Title not compliant with the naming convention.')
    } else if (currentComment) {
        github.rest.issues.deleteComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: currentComment.id,
        })
    }
}