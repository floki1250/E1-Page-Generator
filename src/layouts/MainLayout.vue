<template>
  <div class="title">E1 Page Generators</div>

  <div class="row" style="padding: 50px">
    <!-- widget 1 : Open File -->
    <div class="widget fluent">
      <q-file
        rounded
        outlined
        v-model="model"
        label="Pick File"
        color="indigo"
        bg-color="white"
        style="width: 480px"
        @change="loadTextFromFile"
        ><template v-slot:after>
          <q-btn
            round
            dense
            flat
            icon="las la-file-import"
            size="20px"
            color="white"
            v-model="model"
          />
          <br /> </template
      ></q-file>
      <p class="file_holder">{{ Files }}</p>
    </div>
    <!-- Widget 2 : Create File -->
    <div class="widget fluent">
      <q-btn
        icon="las la-plus-square"
        flat
        size="100px"
        rounded
        color="white"
        class="btn"
        @click="create = !create"
      ></q-btn>
    </div>

    <q-dialog v-model="create">
      <q-card class="fluent-white">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold"> Create New Page</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div style="padding: 10px">
            <q-input type="text" label="Title" v-model="Title" color="indigo" />
            <q-input
              type="text"
              label="Page Id"
              v-model="PageId"
              color="indigo"
            />
            <div>
              <q-radio
                dense
                v-model="type"
                val="ReportId"
                label="Report"
                style="padding: 10px"
                color="indigo"
              />
              <q-radio
                dense
                v-model="type"
                val="AppId"
                label="Program"
                style="padding: 10px"
                color="indigo"
              />
            </div>
            <q-separator />
            <q-input type="text" label="ID" v-model="id" color="indigo" />
            <q-input type="text" label="name" v-model="name" color="indigo" />
            <q-input
              type="text"
              label="Version"
              v-model="Version"
              color="indigo"
            />
            <div v-if="type == 'AppId'">
              <q-input
                type="text"
                label="Window"
                v-model="Window"
                color="indigo"
              />
            </div>
            <!-- <q-select v-model="alphabet" :options="options" label="Alphabet" /> -->
            <div>
              <q-btn
                color="indigo"
                icon="las la-plus"
                style="margin: 50px"
                rounded
                @click="add"
                >Add</q-btn
              >
              <strong>{{ count }} lines Added</strong>
              <q-btn
                color="indigo"
                icon="check"
                label="Create"
                style="margin: 30px"
                rounded
                @click="CreateFile"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <div>
    <q-btn color="primary" icon="las la-info-circle" flat size="lg" round />
  </div>
</template>

<script>
var data = "";
var i = 1;
var j = 0;
var T = [];
export default {
  data() {
    return {
      PageId: "",
      count: 0,
      options: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      alphabet: "",
      create: false,
      type: "AppId",
      Version: "",
      Window: "",
      Title: "",
      id: "",
      name: "",
      model: "",
      Files: [],
    };
  },
  methods: {
    writeToFileSync(filename, content) {
      const fs = window.require("fs");
      const path = require("path");
      const username = path.resolve(__dirname);
      filename =
        "C:\\Users\\" +
        username.split("\\")[2] +
        "\\Desktop\\" +
        path.normalize(filename);
      fs.writeFileSync(filename, content);
    },
    add() {
      T[i] =
        "@" +
        this.options[j] +
        ":" +
        this.type +
        "=" +
        this.id +
        "|FormId=" +
        this.Window +
        "|" +
        "Version=" +
        this.Version +
        ":" +
        this.name +
        ":" +
        "runE1App" +
        "('" +
        this.id +
        "','" +
        this.Window +
        "','" +
        this.Version +
        "')" +
        "\n";
      j++;
      i++;
      this.count++;
      this.id = "";
      this.Window = "";
      this.Version = "";
      this.name = "";
    },
    CreateFile() {
      var part2 = "";
      for (var i = 1; i < T.length; i++) {
        part2 += T[i];
      }
      data =
        "%" +
        this.Title +
        "%" +
        "\n" +
        "*flowstyle=smallIcons" +
        "\n" +
        "\n" +
        part2 +
        "\n";
      this.writeToFileSync("E1XX.dat", data);
      console.log(data);
    },
    loadTextFromFile() {
      const reader = new FileReader();
      reader.readAsText(this.model);
      reader.onload = (res) => {
        console.log(res.target.result);
        this.Files = res.target.result;
      };
    },
  },
};
</script>
