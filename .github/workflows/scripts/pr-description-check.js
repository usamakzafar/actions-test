module.exports = async ({ github, context, core }) => {



	const COMMENT_HEADER = "**No image found.**"
	const COMMENT_BODY = "Image not found in the PR description. Please add an image to the PR description for every new key that you are adding. If you do not have an image, please request admin specifically."
	const COMMENT_FOOTER = "If this PR is not introducing any new keys, you may ignore this message."
	const body = `${COMMENT_HEADER} \n${COMMENT_BODY} \n${COMMENT_FOOTER}`

	const prBody = github.context.payload.pull_request.body;
	var hasImage = imageRegex.test(prBody);


    // const { data: comments } = await github.rest.issues.listComments({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     issue_number: context.issue.number,
    // })
	    // const currentComment = comments.find(comment => comment.body.startsWith(COMMENT_HEADER))
    
	if (hasImage) {
		core.notice("Image found in the PR description with updated import.");

		// If PR Description has image, then remove comment (if exists)
		// if (currentComment) {
	    //     github.rest.issues.deleteComment({
	    //         issue_number: context.issue.number,
	    //         owner: context.repo.owner,
	    //         repo: context.repo.repo,
	    //         comment_id: currentComment.id,
	    //     })
	    // }
	} else {


		core.setFailed("Image not found in the PR description. Please add an image to the PR description for every new key that you are adding. If you do not have an image, please request admin specifically.");
	
	    // If already commented, update it
        // if (currentComment) {
        //     github.rest.issues.updateComment({
        //         issue_number: context.issue.number,
        //         owner: context.repo.owner,
        //         repo: context.repo.repo,
        //         comment_id: currentComment.id,
        //         body: body
        //     })
        // } else {
        	// Create new comment
            github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
            })
        // }
	    }
}