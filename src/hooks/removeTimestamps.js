// function that takes in an array of estimate objects and strips away the timestamps from the dates
export default function removeTimestamps(estimateArray) {
    // loop through the supplied array and remove timestamps from the data coming back from date columns in the DB
    estimatesArray.forEach(estimate => {
        Object.assign(estimate, {
            date_created: estimate.date_created.split('T')[0],
            
        })
        estimate.date_created = estimate.date_created.split('T')[0];
        estimate.anticipated_first_pour_date = estimate.anticipated_first_pour_date.split('T')[0];
    })
    // return the mutated object array
    return estimateArray;
}