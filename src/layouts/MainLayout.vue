<template>
  <div class="title">E1 Page Generators</div>

  <div class="row" style="padding: 50px 0px 50px 50px">
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
            @click="OpenFile"
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
    <q-dialog v-model="Edit">
      <q-card class="fluent-white">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold"> Edit Page</span>
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="ClearData"
          />
        </q-toolbar>
        <q-card-section class="row items-center">
          <div style="padding: 10px">
            <q-input
              type="text"
              label="Title"
              v-model="ETitle"
              color="indigo"
              autogrow
            />
            <q-input
              type="text"
              label="PageId"
              v-model="EPageId"
              color="indigo"
            />
            <q-separator />
            <q-select
              flat
              :options="Eopt"
              v-model="Eselectedopt"
              style="width: 100%; padding-top: 20px"
              color="indigo"
              map-options
              emit-value
              autogrow
              @update:model-value="Viewfile"
              behavior="dialog"
            ></q-select>
            <q-separator />
            <q-input type="text" label="ID" v-model="Eid" color="indigo" />
            <q-input type="text" label="name" v-model="Ename" color="indigo" autogrow/>
            <q-input
              type="text"
              label="Version"
              v-model="EVersion"
              color="indigo"
            />
            <div v-if="Eid.substring(0,1) == 'P'">
              <q-input
                type="text"
                label="Window"
                v-model="EWindow"
                color="indigo"
              />
            </div>

            <q-btn
              color="indigo"
              icon="las la-plus"
              style="margin: 50px"
              rounded
              push
            >
            </q-btn>

            <q-btn
              color="indigo"
              icon="las la-angle-right"
              style="margin: 30px"
              rounded
              push
              @click="Viewfile"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="Section">
      <q-card class="fluent-white" style="width: 100%">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold">Add Sections</span>
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup="2"
            @click="ClearData"
          />
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
                dense
                push
                @click="AddLine"
                ><q-tooltip class="bg-indigo-10"> Add Line </q-tooltip></q-btn
              >
              <q-btn
                color="indigo"
                icon="las la-minus"
                rounded
                dense
                push
                @click="RemoveLine"
                ><q-tooltip class="bg-indigo-10">
                  Remove Line
                </q-tooltip></q-btn
              ></template
            ></q-select
          >
          <div>
            <q-btn
              color="indigo"
              icon="las la-plus"
              rounded
              @click="AddSection"
              push
              style="margin: 50px"
            >
              <q-tooltip class="bg-indigo-10"> Add Section </q-tooltip>
            </q-btn>
            <q-btn
              color="indigo-10"
              icon="las la-file"
              rounded
              @click="CreateFile"
              push
              :loading="loading"
              ><q-tooltip class="bg-indigo-10">Create File</q-tooltip
              ><template v-slot:loading> <q-spinner-gears /> </template
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    <!-- Create File Dialog -->
    <q-dialog v-model="create">
      <q-card class="fluent-white">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold"> Create New Page</span>
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="ClearData"
          />
        </q-toolbar>

        <q-card-section class="row items-center">
          <div style="padding: 10px">
            <q-input
              type="text"
              label="Title"
              v-model="Title"
              color="indigo"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              type="text"
              label="PageId"
              v-model="PageId"
              color="indigo"
              hint="Exemple E1XX"
              prefix="E1"
              :rules="[(val) => !!val || 'Field is required']"
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
            <q-input
              type="text"
              label="ID"
              v-model="id"
              color="indigo"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              type="text"
              label="name"
              v-model="name"
              color="indigo"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              type="text"
              label="Version"
              v-model="Version"
              color="indigo"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <div v-if="type == 'AppId'">
              <q-input
                type="text"
                label="Window"
                v-model="Window"
                color="indigo"
                :rules="[(val) => !!val || 'Field is required']"
              />
            </div>
            <!-- <q-select v-model="alphabet" :options="options" label="Alphabet" /> -->
            <div>
              <q-btn
                color="indigo"
                icon="las la-plus"
                style="margin: 50px"
                rounded
                push
                @click="add"
              >
                <q-badge color="red" :label="count" floating />
              </q-btn>

              <q-btn
                color="indigo"
                icon="las la-angle-right"
                style="margin: 30px"
                rounded
                push
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

            <q-btn
              flat
              round
              dense
              icon="close"
              v-close-popup="2"
              @click="ClearData"
            />
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
                  dense
                  push
                  @click="AddLine"
                  ><q-tooltip class="bg-indigo-10"> Add Line </q-tooltip></q-btn
                >
                <q-btn
                  color="indigo"
                  icon="las la-minus"
                  rounded
                  dense
                  push
                  @click="RemoveLine"
                  ><q-tooltip class="bg-indigo-10">
                    Remove Line
                  </q-tooltip></q-btn
                ></template
              ></q-select
            >
            <div>
              <q-btn
                color="indigo"
                icon="las la-plus"
                rounded
                @click="AddSection"
                push
                style="margin: 50px"
              >
                <q-tooltip class="bg-indigo-10"> Add Section </q-tooltip>
              </q-btn>
              <q-btn
                color="indigo-10"
                icon="las la-file"
                rounded
                @click="CreateFile"
                push
                :loading="loading"
                ><q-tooltip class="bg-indigo-10">Create File</q-tooltip
                ><template v-slot:loading> <q-spinner-gears /> </template
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-dialog>
    <!-- About Me Dialog -->
  </div>
  <div style="position: fixed; top: 90%; left: 85%; z-index: 1000">
    <q-btn
      color="primary"
      icon="las la-info-circle"
      flat
      size="lg"
      round
      @click="AboutMe = !AboutMe"
    />
  </div>
  <q-dialog v-model="AboutMe" persistent>
    <q-card>
      <q-toolbar>
        <q-toolbar-title
          ><span class="text-weight-bold">About Us</span></q-toolbar-title
        >
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section style="margin-left: 10px">
        <q-avatar
          size="200px"
          font-size="52px"
          color="grey"
          text-color="black"
          style="margin: 20px"
        >
          <img src="../assets/Brand.png" alt="" />
        </q-avatar>
        <q-separator />
        <p class="info">Hi 👋, I'm Floki Web Developer</p>
        <p class="info">For Any Support You can Find me Here</p>
        <div class="row">
          <q-btn
            flat
            round
            color="primary"
            icon="lab la-twitter"
            size="25px"
            @click="CopytoClipboard('Adem1250_Dr')"
          >
            <q-tooltip> Adem1250_Dr </q-tooltip></q-btn
          >
          <q-btn
            flat
            round
            color="black"
            icon="lab la-github"
            size="25px"
            @click="CopytoClipboard('floki1250')"
            ><q-tooltip> floki1250 </q-tooltip></q-btn
          >
          <q-btn
            icon="las la-envelope"
            color="black"
            size="25px"
            flat
            round
            @click="CopytoClipboard('d.adem1250@gmail.com')"
          >
            <q-tooltip> d.adem1250@gmail.com </q-tooltip>
          </q-btn>
        </div>
        <q-btn flat rounded style="margin-left: 10px"
          >Made with ❤️ in Tunisia</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
var data = "";
var i = 1;
var j = 0;
var T = [];
var part2 = "";
var lines = [[]];
var selectedoptcount = 1;
var linepart = "";
var part1 = "";
export default {
  data() {
    return {
      //Edit Page
      Elines: 1,
      Eline: 1,
      Edit: false,
      EPageId: "",
      EVersion: "",
      EWindow: "",
      ETitle: "",
      Eid: "",
      Ename: "",
      Eselectedopt: "",
      Eopt: [{ label: "", Alpha: "", Id: "", Name: "", V: "", FormId: "" }],
      Etype : true,
      //Create Page
      loading: false,
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
      AboutMe: false,
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
    OpenFile() {
      this.Edit = !this.Edit;
      var str = "";
      var countFirstPart1 = 0;
      var countFirstPart2 = 0;
      var titleLastStr = 0;
      var firstpartDeb = 0;
      var firstpartEnd = 0;
      var T = [];
      var K = [];
      var Tab = [];
      this.EPageId = this.model.name.replaceAll(".dat", "");
      for (var i = 0; i < this.Files.length; i++) {
        str = this.Files.substring(i, i + 1);
        if (str == "%") {
          titleLastStr = i;
          console.log(titleLastStr);
        }
        if (str == "@" && countFirstPart1 == 0) {
          firstpartDeb = i;
          countFirstPart1 = 1;
        }
        if (str == "+" && countFirstPart2 == 0) {
          firstpartEnd = i;
          countFirstPart2 = 1;
        }
      }
      //get Title of the File
      console.log("\nTitle :\n" + this.Files.substring(1, titleLastStr));
      this.ETitle = this.Files.substring(1, titleLastStr);
      //get First Part of the File
      console.log(
        "\nPart 1  \n:" + this.Files.substring(firstpartDeb, firstpartEnd)
      );
      //get Second Part of the File
      console.log(
        "\nPart 2  :\n" + this.Files.substring(firstpartEnd, this.Files.length)
      );
      //Slice part 1
      T = this.Files.substring(firstpartDeb, firstpartEnd).split("@");
      //console.log(T);

      console.log("\n===============\n");
      for (var i = 1; i < T.length; i++) {
        this.Elines = T.length;
        K[i] = T[i].toString().split(":");
        Tab[i] = K[i][1]
          .replaceAll("AppId=", "|")
          .replaceAll("ReportId=", "|")
          .replaceAll("FormId=", "")
          .replaceAll("Version=", "")
          .split("|");
        if (Tab[i][1].substring(0, 1) == "P") {
          console.log(
            "| " +
              K[i][0] +
              " |Title :" +
              K[i][2] +
              " |Program Id : " +
              Tab[i][1] +
              " |Version:" +
              Tab[i][3] +
              " |Form Id :" +
              Tab[i][2]
          );
          this.Eopt[i] = Object.assign(
            {
              label:
                "| " +
                K[i][0] +
                " |Title :" +
                K[i][2] +
                " |Program Id : " +
                Tab[i][1] +
                " |Version:" +
                Tab[i][3] +
                " |Form Id :" +
                Tab[i][2],
              Alpha: K[i][0],
              Id: Tab[i][1],
              Name: K[i][2],
              V: Tab[i][3],
              FormId: Tab[i][2],
            },
            this.Eopt[i]
          );
        } else {
          this.Eopt[i] = Object.assign(
            {
              label:
                "|" +
                K[i][0] +
                " |Title :" +
                K[i][2] +
                " |Report id : " +
                Tab[i][1] +
                " |Version:" +
                Tab[i][2],
              Alpha: K[i][0],
              Id: Tab[i][1],
              Name: K[i][2],
              V: Tab[i][2],
            },
            this.Eopt[i]
          );
        }
      }
    },
    Viewfile() {
      this.Eid = this.Eselectedopt.Id;
      this.Ename = this.Eselectedopt.Name;
      this.EVersion = this.Eselectedopt.V;
      this.EWindow = this.Eselectedopt.FormId;
      // if (this.Eid.substring(0,1) == 'P') {
      //  this.Etype == true ;
      // }else  this.Etype == false ;
    },
    CopytoClipboard(text) {
      const { clipboard } = window.require("electron");
      clipboard.writeText(text);
      const notifier = window.require("node-notifier");
      const path = require("path");
      notifier.notify({
        title: "Copied !",
        message: "Copied To Your clipboard \n" + text,
        icon: path.join("Res/", "Brand.png"),
        sound: true,
      });
    },
    ClearData() {
      this.loading = false;
      data = "";
      i = 1;
      j = 0;
      T = [];
      part2 = "";
      lines = [[]];
      selectedoptcount = 1;
      linepart = "";
      part1 = "";
      this.SectionCounter = 1;
      this.SectionName = "";
      this.LineSection = "";
      this.lines = 1;
      this.line = 1;
      this.Version = "";
      this.Window = "";
      this.Title = "";
      this.id = "";
      this.name = "";
      this.count = 0;
    },
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
      linepart +=
        lines[[this.SectionCounter][this.line]]
          .toString()
          .replace(",", "     ") +
        "\n" +
        "=" +
        "\n";
      this.line++;
      this.lines++;
    },
    AddSection() {
      part2 +=
        "+section:collapsible:" +
        this.SectionName +
        "\n" +
        "=" +
        "\n" +
        linepart;
      linepart = "";
      this.SectionCounter++;
      // this.selectedoptSections[] = "" ;
      this.SectionName = "";
      this.line = 1;
      this.lines = 1;
      for (let i = 0; i < this.selectedoptSections.length; i++) {
        this.selectedoptSections[i] = null;
      }

      part2 = part2.replace(",", "     ");
    },
    loadTextFromFile() {
      const reader = new FileReader();
      reader.readAsText(this.model);
      reader.onload = (res) => {
        console.log(res.target.result);
        this.Files = res.target.result;
      };
    },
    writeToFileSync(filename, content) {
      const fs = window.require("fs");
      const path = require("path");
      filename = "Res/E1PageGenerator/dat_files/" + path.normalize(filename);
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
      this.loading = true;
      for (var i = 1; i < T.length; i++) {
        part1 += T[i];
      }
      data =
        "%" +
        this.Title +
        "%" +
        "\n" +
        "*flowstyle=smallIcons" +
        "\n" +
        "\n" +
        part1 +
        "\n" +
        part2.replaceAll(",", "     ");
      const filename = "E1" + this.PageId + ".dat";
      this.writeToFileSync(filename, data);
      const notifier = window.require("node-notifier");
      const path = require("path");
      var child = window.require("child_process").execFile;
      child.spawn = window.require("cross-spawn");
      var executablePath = "ExecuteGenerator.bat";
      child(executablePath, function (err, data) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data.toString());
      });
      setTimeout(function () {
        notifier.notify({
          title: "Done",
          message: "Your File Ready " + filename,
          sound: true,
          icon: path.join("Res/", "logo.png"),
        });
      }, 3000);
      this.loading = false;
      this.ClearData;
    },
  },
};
</script>
