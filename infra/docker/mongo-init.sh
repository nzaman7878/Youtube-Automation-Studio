#!/bin/bash
set -e

echo "Waiting for MongoDB node to become reachable..."
until mongosh --host mongo:27017 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done

echo "Checking MongoDB Replica Set status..."
RS_STATUS=$(mongosh --host mongo:27017 --quiet --eval "rs.status().ok" 2>/dev/null || echo "0")

if [ "$RS_STATUS" != "1" ]; then
  echo "Initiating replica set 'rs0' for MongoDB..."
  mongosh --host mongo:27017 --eval '
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "mongo:27017" }
      ]
    });
  '
  echo "Replica set 'rs0' successfully initiated."
else
  echo "Replica set 'rs0' is already active."
fi
