import Dexie from 'dexie'

const db = new Dexie('kifuDB')
db.version(1).stores({
  kifu: `&name, obj`
})

export default db
