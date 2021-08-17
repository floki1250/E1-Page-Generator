<template>
  <div class="title">E1 Page Generators</div>

  <div class="row" style="padding: 50px 0px 50px 100px">
    <!-- widget 1 : Open File -->
    <div class="widget fluent">
      <q-file
        rounded
        outlined
        v-model="model"
        label="Pick File .dat File"
        color="indigo"
        bg-color="grey-1"
        style="margin: 10px; width: 480px"
        dense
        @change="loadTextFromFile"
        accept=".Dat"
        ><template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="las la-file-import"
            size="20px"
            color="indigo-10"
            v-model="model"
          />
          <br /> </template
      ></q-file>

      <textarea
        rows="2"
        cols="20"
        wrap="hard"
        v-model="Files"
        class="file_holder"
        readonly
        autofocus
        placeholder="File Here..."
      ></textarea>
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

        <q-card-section class="row items-center">
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
              >
                <q-badge color="red" :label="count" floating />
              </q-btn>

              <q-btn
                color="indigo"
                icon="las la-angle-right"
                style="margin: 30px"
                rounded
                @click="Section = !Section"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="Section">
        <q-card class="fluent-white" style="width: 100%">
          <q-toolbar>
            <q-toolbar-title
              ><span class="text-weight-bold">Add Sections</span>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-card-section>
            <strong
              >Section
              <q-badge color="indigo" :label="SectionCounter" /> :</strong
            >

            <q-input
              type="text"
              label="Section Name"
              color="indigo"
              v-model="SectionName"
            >
            </q-input>

            <q-select
              flat
              multiple
              :options="selectedopt"
              counter
              v-model="selectedoptSections[line]"
              behavior="menu"
              style="width: 100%; padding-top: 20px"
              color="indigo"
              v-for="line in lines"
              v-bind:key="line"
              map-options
              use-chips
              emit-value
              ><template v-slot:after>
                <q-btn
                  color="indigo"
                  icon="las la-plus"
                  rounded
                  @click="AddLine" />
                <q-btn
                  color="indigo"
                  icon="las la-minus"
                  rounded
                  @click="RemoveLine" /></template
            ></q-select>
            <div>
              <q-btn
                color="indigo"
                icon="las la-plus"
                style="margin: 30px"
                rounded
                @click="AddSection"
                label="Add Section"
              ></q-btn>
              <q-btn
                color="indigo"
                icon="las la-file"
                rounded
                @click="CreateFile"
                label="Create File"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-dialog>
  </div>
  <div style="position: fixed; top: 90%; left: 85%; z-index: 1000">
    <q-btn color="primary" icon="las la-info-circle" flat size="lg" round />
  </div>
</template>

<script>
var data = "";
var i = 1;
var j = 0;
var T = [];
var part2 = "" ;
var lines = [[]];
var selectedoptcount = 1;
var linepart = "";
var part1 = "";
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
      Section: false,
      type: "AppId",
      Version: "",
      Window: "",
      Title: "",
      id: "",
      name: "",
      model: "",
      Files: [],
      selectedopt: [
        {
          label: "",
          value: "",
        },
      ],
      selectedoptSections: [],
      Sections: [],
      SectionCounter: 1,
      SectionName: "",
      LineSection: "",
      lines: 1,
      line: 1,
    };
  },
  methods: {
    RemoveLine() {
      this.line--;
      this.lines--;
      if (this.lines < 1) {
        this.line++;
        this.lines++;
      }
    },
    AddLine() {
      lines[[this.SectionCounter][this.line]] = this.selectedoptSections[
        this.line
      ]
        .toString()
        .split(",");
      console.log("Section Counter : " + this.SectionCounter);
      console.log("Line : " + this.line);
      console.log(lines[[this.SectionCounter][this.line]] + "\n");
      this.line++;
      this.lines++;
    },
    AddSection() {
      
      this.SectionCounter++;
      // this.selectedoptSections[] = "" ;
      this.SectionName = "";
      this.line = 1;
      this.lines = 1;
      this.selectedoptSections[1] = null;
    },
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
      this.selectedopt[selectedoptcount] = Object.assign(
        { label: T[i].toString(), value: this.options[j].toString() },
        this.selectedopt[selectedoptcount]
      );

      j++;
      i++;

      selectedoptcount++;

      this.count++;
      this.id = "";
      this.Window = "";
      this.Version = "";
      this.name = "";
    },
    CreateFile() {
      
      for (var i = 1; i < T.length; i++) {
        part1 += T[i];
      }
      for (var i = 1; i <= this.SectionCounter; i++) {
        for (let j = 1; j <= this.line; j++) {
          linepart += lines[[i][j]] + "\n"+"=";
        }
        part2 +="+section:collapsible:" + this.SectionName + "\n" + "=" + "\n"+linepart;
        linepart="";
      }
      console.log(part2);
      data =
        "%" +
        this.Title +
        "%" +
        "\n" +
        "*flowstyle=smallIcons" +
        "\n" +
        "\n" +
        part1 +
        "\n";
      const filename = this.PageId + ".dat";
      this.writeToFileSync(filename, data);
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
