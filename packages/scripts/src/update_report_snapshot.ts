import './prepare'
import { generateDevlogFromSnapshotsDiff, updateSnapshots } from './utils/report'

await updateSnapshots()
// These outputs are for use with GitHub Actions.
console.log('generateDevlogFromSnapshotsDiff():')
console.log(generateDevlogFromSnapshotsDiff())
