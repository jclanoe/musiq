
function openDatabase() {
    try {
        if (!window.openDatabase) {
            return null;
        }
        else {
            var databaseName = 'musiqDatabase';
            var version = '1.0';
            var displayName = 'MusiQ Database';
            var maxSize = 1024 * 1024 * 10;
            var db = openDatabase(
                databaseName,
                version,
                displayName,
                maxSize
            );
            return db;
        }
    }
    catch(errorCode) {
        // TODO: Handle errors
        if (errorCode == 2) {
            // Version number mismastch
        }
        else {
            // Unknown error
        }
        return null
    }
}

function createTables(db) {
    db.transaction(function(transaction) {
        transaction.executeSql("CREATE TABLE IF NOT EXISTS queue(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, type TEXT);");
    });
}
