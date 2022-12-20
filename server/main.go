package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	/*
	   Connect to my cluster
	*/
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://root:Hah7TfHHS5XrqLT4Y@tracker-mongodb:27017/?authSource=admin"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	/*
	   List databases
	*/
	databases, err := client.ListDatabaseNames(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(databases)

	/*
	   Define my document struct
	*/
	type Months struct {
		Title string `bson:"title,omitempty"`
		Body  string `bson:"body,omitempty"`
	}

	/*
	   Get my collection instance
	*/
	collection := client.Database("tracker").Collection("months")

	/*
	   Insert documents
	*/
	docs := []interface{}{
		bson.D{{"title", "march3"}, {"body", "{\"name\":\"March2\",\"days\":31,\"habits\":[{\"name\":\"hab1\",\"planned\":[16],\"done\":[],\"undone\":[24]},{\"name\":\"hab2\",\"planned\":[10,17,20,24,16,13,14,15],\"done\":[],\"undone\":[]},{\"name\":\"hab3\",\"planned\":[25,16],\"done\":[24],\"undone\":[]},{\"name\":\"hab4\",\"planned\":[15],\"done\":[14],\"undone\":[]}]}"}},
		bson.D{{"title", "april3"}, {"body", "{\"name\":\"April2\",\"days\":31,\"habits\":[{\"name\":\"hab1\",\"planned\":[16],\"done\":[],\"undone\":[24]},{\"name\":\"hab2\",\"planned\":[10,17,20,24,16,13,14,15],\"done\":[],\"undone\":[]},{\"name\":\"hab3\",\"planned\":[2,6],\"done\":[4],\"undone\":[]},{\"name\":\"hab4\",\"planned\":[5],\"done\":[10],\"undone\":[]}]}"}},
	}

	res, insertErr := collection.InsertMany(ctx, docs)
	if insertErr != nil {
		log.Fatal(insertErr)
	}
	fmt.Println(res)
	/*
	   Iterate a cursor and print it
	*/
	cur, currErr := collection.Find(ctx, bson.D{})

	if currErr != nil {
		panic(currErr)
	}
	defer cur.Close(ctx)

	var months []Months
	if err = cur.All(ctx, &months); err != nil {
		panic(err)
	}
	fmt.Println(months)

}
