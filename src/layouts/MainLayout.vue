<template>
  <div class="title">E1 Page Generators</div>
  <div class="row" style="padding: 20px 0px 50px 50px">
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
    <q-dialog
      v-model="Edit"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="fluent-white">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold" style="color: #293b5f">
              Edit Page</span
            >
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="ClearData"
            color="indigo-10"
          />
        </q-toolbar>
        <q-card-section class="row items-center">
          <div style="width: 100%">
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

            <q-select
              flat
              :options="Eopt"
              v-model="Eselectedopt"
              style="width: 100%; padding: 10px 0px 10px 0px"
              color="indigo"
              map-options
              emit-value
              autogrow
              @update:model-value="Viewfile"
              behavior="dialog"
              ref="select"
            >
              <template v-slot:after>
                <q-btn
                  color="indigo"
                  icon="las la-plus"
                  rounded
                  dense
                  flat
                  @click="ESectionLineDialog"
                  ><q-tooltip class="bg-indigo-10"> Add Line </q-tooltip></q-btn
                >
                <q-btn
                  color="indigo"
                  icon="las la-minus"
                  rounded
                  dense
                  flat
                  @click="ERemoveLine"
                  ><q-tooltip class="bg-indigo-10">
                    Remove Line
                  </q-tooltip></q-btn
                ></template
              >
            </q-select>

            <q-input type="text" label="ID" v-model="Eid" color="indigo" />
            <q-input
              type="text"
              label="name"
              v-model="Ename"
              color="indigo"
              autogrow
            />
            <q-input
              type="text"
              label="Version"
              v-model="EVersion"
              color="indigo"
            />
            <q-slide-transition>
              <div v-if="Eid.substring(0, 1) == 'P'">
                <q-input
                  type="text"
                  label="Window"
                  v-model="EWindow"
                  color="indigo"
                />
              </div>
            </q-slide-transition>
            <div class="btn" style="margin-top: 50px">
              <q-btn
                color="indigo"
                icon="las la-check"
                style="margin: 10px"
                flat
                rounded
                size="lg"
                @click="UpdateFile"
              >
              </q-btn>

              <q-btn
                color="indigo"
                icon="las la-angle-right"
                style="position: absolute; right: 20px; margin: 10px"
                rounded
                flat
                size="lg"
                @click="ESection = !ESection"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="ESectionLine" persistent>
        <q-card>
          <q-toolbar>
            <q-toolbar-title
              ><span class="text-weight-bold" style="color: #293b5f">
                Add Line</span
              >
            </q-toolbar-title>

            <q-btn
              flat
              round
              dense
              icon="close"
              v-close-popup
              color="indigo-10"
            />
          </q-toolbar>

          <q-card-section class="row items-center">
            <div>
              <q-radio
                v-model="type"
                val="AppId"
                label="Program"
                color="indigo"
              />
              <q-radio
                v-model="type"
                val="ReportId"
                label="Report"
                color="indigo"
              />
            </div>
            <q-input v-model="Eid2" type="text" label="P/R Id" color="indigo" />
            <q-input
              v-model="Ename2"
              type="text"
              label="Name "
              color="indigo"
            />
            <q-input
              :disable="VersionCheck"
              v-model="EVersion2"
              type="text"
              label="Version"
              color="indigo"
              ><template v-slot:after>
                <q-btn
                  color="indigo"
                  icon="las la-times-circle"
                  @click="
                    {
                      type == 'AppId'
                        ? (VersionCheck = !VersionCheck)
                        : (VersionCheck = false);
                    }
                  "
                  flat
                  round
                />
              </template>
            </q-input>

            <q-slide-transition>
              <div v-if="type == 'AppId'" style="width: 100%">
                <q-input
                  v-model="EWindow2"
                  type="text"
                  label="Window"
                  color="indigo"
                />
              </div>
            </q-slide-transition>

            <q-btn
              color="indigo"
              icon="check"
              label="Valide"
              rounded
              outline
              style="margin: 30px 0px 10px 40%"
              @click="EAddLine"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="ESection"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-toolbar>
            <q-toolbar-title
              ><span class="text-weight-bold" style="color: #293b5f">
                Edit Section</span
              >
            </q-toolbar-title>

            <q-btn
              flat
              round
              dense
              icon="close"
              v-close-popup
              color="indigo-10"
            />
          </q-toolbar>
          <q-card-section class="row items-center">
            <div class="fluent" style="border-radius: 5px; margin: 10px">
              <textarea
                rows="2"
                cols="60"
                wrap="hard"
                v-model="EsectionField"
                class="section"
                placeholder="Sections"
              ></textarea>
            </div>
            <div class="btn">
              <q-btn
                color="indigo-10"
                icon="las la-file"
                rounded
                @click="EditFile"
                flat
                size="lg"
                :loading="loading"
                style="margin-left: 42%"
                ><q-tooltip class="bg-indigo-10">Create File</q-tooltip
                ><template v-slot:loading> <q-spinner-gears /> </template
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-dialog>

    <!-- Widget 2 : Create File -->
    <div class="widget fluent">
      <q-btn
        icon="las la-plus-square"
        flat
        size="100px"
        rounded
        color="white"
        style="width: 100%; height: 100%"
        @click="create = !create"
      ></q-btn>
    </div>
    <!-- Create File Dialog -->
    <q-dialog
      v-model="create"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="fluent-white">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold" style="color: #293b5f">
              Create New Page</span
            >
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="ClearData"
            color="indigo-10"
          />
        </q-toolbar>

        <q-card-section class="row items-center">
          <div style="width: 100%">
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
            <div class="row">
              <q-input
                :disable="VersionCheck"
                type="text"
                label="Version"
                v-model="Version"
                color="indigo"
                :rules="[(val) => !!val || 'Field is required']"
              >
                <template v-slot:after
                  ><q-btn
                    color="indigo"
                    icon="las la-minus-circle"
                    @click="VersionCheck = !VersionCheck"
                    flat
                    round
                /></template>
              </q-input>
            </div>
            <q-slide-transition>
              <div v-if="type == 'AppId'">
                <q-input
                  type="text"
                  label="Window"
                  v-model="Window"
                  color="indigo"
                  :rules="[(val) => !!val || 'Field is required']"
                />
              </div>
            </q-slide-transition>
            <div class="btn">
              <q-btn
                color="indigo"
                icon="las la-plus"
                rounded
                flat
                @click="add"
                size="lg"
                style="margin: 10px"
              >
                <q-badge color="red" :label="count" floating />
              </q-btn>

              <q-btn
                color="indigo"
                icon="las la-angle-right"
                rounded
                flat
                @click="Section = !Section"
                size="lg"
                style="position: absolute; right: 20px; margin: 10px"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog
        v-model="Section"
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
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
                  flat
                  @click="AddLine"
                  ><q-tooltip class="bg-indigo-10"> Add Line </q-tooltip></q-btn
                >
                <q-btn
                  color="indigo"
                  icon="las la-minus"
                  rounded
                  dense
                  flat
                  @click="RemoveLine"
                  ><q-tooltip class="bg-indigo-10">
                    Remove Line
                  </q-tooltip></q-btn
                ></template
              ></q-select
            >
            <div class="btn">
              <q-btn
                color="indigo"
                icon="las la-plus"
                rounded
                @click="AddSection"
                flat
                style="margin: 10px"
                size="lg"
              >
                <q-tooltip class="bg-indigo-10"> Add Section </q-tooltip>
              </q-btn>
              <q-btn
                color="indigo-10"
                icon="las la-file"
                rounded
                @click="CreateFile"
                flat
                size="lg"
                :loading="loading"
                style="position: absolute; right: 20px; margin: 10px"
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
  <div style="position: absolute; top: 92%; right: 2%; z-index: 1000">
    <q-btn
      color="primary"
      icon="las la-info-circle"
      flat
      size="md"
      round
      @click="AboutMe = !AboutMe"
    />
  </div>
  <div style="position: absolute; top: 86%; right: 2%; z-index: 1000">
    <q-btn
      color="primary"
      icon="las la-cog"
      flat
      size="md"
      round
      @click="settings = !settings"
    />
  </div>
  <q-dialog v-model="AboutMe">
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
  <q-dialog v-model="settings">
    <q-card>
      <q-toolbar>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="row items-center">
        <p style="font-size: 25px">
          E1 Page Generator
          <q-badge
            color="red"
            text-color="whitesmoke"
            label="v0.0.1"
            style="position: absolute; top: 2%"
          />
        </p>
        <q-separator style="width: 100%; margin: 10px 0px 20px 0px" />
        <p>
          Designers can create new, or modify existing EnterpriseOne Pages using
          an HTML editor. (Designers must be proficient in coding HTML to create
          or modify EnterpriseOne Pages). Designers save the EnterpriseOne pages
          and supporting files as a .zip or .jar file, ensuring that the
          EnterpriseOne Page resides at the root of the file structure and is
          named as home.htm or file structure and is named as home.html.
          Designers can create EnterpriseOne Pages, or use one of the templates
          available in EnterpriseOne. These templates contain interactive
          process models for EnterpriseOne tasks, which designers can use as a
          basis for creating their own EnterpriseOne Pages.
        </p>
        <q-separator style="width: 100%; margin: 10px 0px 20px 0px" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
var data = "";
var i = 1;
var j = 0;
var T = [];
var part2 = "";
var lines = [[]];
var selectedoptcount = 1;
var linepart = "";
var part1 = "";
const path = require("path");
export default {
  data() {
    return {
      settings: false,
      //Edit Page
      ESection: false,
      EsectionField: "",
      Available_Alpha: [],
      EVersion2: "",
      EWindow2: "",
      Eid2: "",
      Ename2: "",
      ESectionLine: false,
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
      Etype: true,
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
      VersionCheck: false,
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
    EditFile() {
      var content = "";
      var epart1="" ;var epart2 ="" 

      for (let i = 1; i < this.Eopt.length; i++) {
        
        if (this.Eopt[i].Id.substring(0, 1) == "P") {
          if ((this.Eopt[i].V == "")) {
            epart1 +=
              "@" +
              this.Eopt[i].Alpha +
              ":AppId=" +
              this.Eopt[i].Id +
              "|FormId=" +
              this.Eopt[i].FormId +
              ":" +
              this.Eopt[i].Name +
              ":" +
              "runE1App" +
              "('" +
              this.Eopt[i].Id +
              "','" +
              "" +
              "','" +
              this.Eopt[i].FormId +
              "')" +
              "\n";
          } else {
            epart1 +=
              "@" +
              this.Eopt[i].Alpha +
              ":AppId=" +
              this.Eopt[i].Id +
              "|FormId=" +
              this.Eopt[i].FormId +
              "|" +
              "Version=" +
              this.Eopt[i].V +
              ":" +
              this.Eopt[i].Name +
              ":" +
              "runE1App" +
              "('" +
              this.Eopt[i].Id +
              "','" +
              this.Eopt[i].FormId +
              "','" +
              this.Eopt[i].V +
              "')" +
              "\n";
            
          }
        } else {
          epart1 +=
            "@" +
            this.Eopt[i].Alpha +
            ":ReportId=" +
            this.Eopt[i].Id +
            "|" +
            "Version=" +
            this.Eopt[i].V +
            ":" +
            this.Eopt[i].Name +
            ":" +
            "runE1UBE" +
            "('" +
            this.Eopt[i].Id +
            "','" +
            "promptForDS" +
            "','" +
            this.Eopt[i].V +
            "')" +
            "\n";
        }
      }
      epart2 = this.EsectionField;
      content =
        "%" +
        this.ETitle +
        "%" +
        "\n" +
        "*flowstyle=smallIcons" +
        "\n" +
        "\n" +
        epart1 +
        "\n" +
        epart2;
      const filename = "E1" + this.EPageId + ".dat";
      this.writeToFileSync(filename, content);
      console.log(content);
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
      
      this.ClearData;
    },
    ESectionLineDialog() {
      this.ESectionLine = !this.ESectionLine;
      this.EVersion2 = "";
      this.EWindow2 = "";
      this.Eid2 = "";
      this.Ename2 = "";
    },
    EAddLine() {
      var count = 0;
      var T = [];
      var options = [];
      var inc_alpha = 1;
      var new_alpha = "";
      if (count == this.Available_Alpha.length) {
        inc_alpha++;
        for (let i = 0; i < 25; i++) {
          new_alpha = this.options[i] + inc_alpha;
          this.Available_Alpha = Object.assign(this.Available_Alpha, new_alpha);
        }
      }
      for (let i = 0; i < this.options.length; i++) {
        options[i] = this.options[i];
      }
      for (let i = 0; i < this.Eopt.length; i++) {
        T[i] = this.Eopt[i].Alpha;
      }
      this.Available_Alpha = options
        .filter((x) => !T.includes(x))
        .concat(T.filter((x) => !options.includes(x)));
      this.Available_Alpha = this.Available_Alpha.filter((x) => x);
      console.log(this.Available_Alpha);
      if (this.type == "AppId") {
        if (this.VersionCheck == true) {
          this.Eopt[i] = Object.assign({}, this.Eopt[i], {
            Alpha: this.Available_Alpha[count],
            label:
              "| " +
              this.Available_Alpha[count] +
              " |Title :" +
              this.Ename2 +
              " |Program Id : " +
              this.Eid2 +
              " |Form Id :" +
              this.EWindow2,
            Id: this.Eid2,
            Name: this.Ename2,
            FormId: this.EWindow2,
            V: "",
          });
        } else {
          this.Eopt[i] = Object.assign({}, this.Eopt[i], {
            Alpha: this.Available_Alpha[count],
            label:
              "| " +
              this.Available_Alpha[count] +
              " |Title :" +
              this.Ename2 +
              " |Program Id : " +
              this.Eid2 +
              " |Version:" +
              this.EVersion2 +
              " |Form Id :" +
              this.EWindow2,
            Id: this.Eid2,
            Name: this.Ename2,
            V: this.EVersion2,
            FormId: this.EWindow2,
          });
        }
      } else {
        this.Eopt[i] = Object.assign({}, this.Eopt[i], {
          Alpha: this.Available_Alpha[count],
          label:
            "|" +
            this.Available_Alpha[count] +
            " |Title :" +
            this.Ename2 +
            " |Report id : " +
            this.Eid2 +
            " |Version:" +
            this.EVersion2,
          Alpha: this.Available_Alpha[count],
          Id: this.Eid2,
          Name: this.Ename2,
          V: this.EVersion2,
        });
      }
      i++;
      count++;

      this.EVersion2 = "";
      this.EWindow2 = "";
      this.Eid2 = "";
      this.Ename2 = "";
    },
    ERemoveLine() {
      for (let i = 0; i < this.Eopt.length; i++) {
        if (this.Eopt[i].Alpha == this.Eselectedopt.Alpha) {
          //delete this.Eopt[i] ;
          //var evens = _.remove(this.Eopt,i)
          this.Eopt.splice(i, 1);
          this.$refs.select.reset();
          this.Eselectedopt = Object.assign({}, this.Eselectedopt, {
            Alpha: "",
            label: "",
            Id: "",
            Name: "",
            V: "",
            FormId: "",
          });
          this.Eid = "";
          this.Ename = "";
          this.EVersion = "";
          this.EWindow = "";
        }
      }
      console.log(this.Eopt);
    },
    UpdateFile() {
      for (let i = 0; i < this.Eopt.length; i++) {
        if (this.Eopt[i].Alpha == this.Eselectedopt.Alpha) {
          //this.Eopt[i].removeAtIndex(i)
          console.log(this.Eopt[i].Alpha);
          this.Eopt[i] = Object.assign({}, this.Eopt[i], {
            Alpha: this.Eopt[i].Alpha,
            label:
              "| " +
              this.Eopt[i].Alpha +
              " |Title :" +
              this.Ename +
              " |Program Id : " +
              this.Eid +
              " |Version:" +
              this.EVersion +
              " |Form Id :" +
              this.EWindow,
            Id: this.Eid,
            Name: this.Ename,
            V: this.EVersion,
            FormId: this.EWindow,
          });
          this.Eselectedopt = Object.assign({}, this.Eselectedopt, {
            Alpha: this.Eopt[i].Alpha,
            label:
              "| " +
              this.Eopt[i].Alpha +
              " |Title :" +
              this.Ename +
              " |Program Id : " +
              this.Eid +
              " |Version:" +
              this.EVersion +
              " |Form Id :" +
              this.EWindow,
            Id: this.Eid,
            Name: this.Ename,
            V: this.EVersion,
            FormId: this.EWindow,
          });
          try {
            console.log(this.$refs.select);
            this.$refs.select.refresh(i);
          } catch {
            e;
            console.log(e);
          }
        }
      }
      console.log(this.Ename);
      console.log(this.Eopt);
      console.log(this.Eselectedopt);
    },
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
      try {
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
          "\nPart 2  :\n" +
            this.Files.substring(firstpartEnd, this.Files.length)
        );
        this.EsectionField = this.Files.substring(
          firstpartEnd,
          this.Files.length
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
      } catch (e) {
        this.Edit = !this.Edit;
        console.log("Error: " + e);
      }
    },
    Viewfile() {
      this.Eid = this.Eselectedopt.Id;
      this.Ename = this.Eselectedopt.Name;
      this.EVersion = this.Eselectedopt.V;
      this.EWindow = this.Eselectedopt.FormId;
    },
    CopytoClipboard(text) {
      const { clipboard } = window.require("electron");
      clipboard.writeText(text);
      const notifier = window.require("node-notifier");

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
      //edit File
      this.EVersion = "";
      this.EWindow = "";
      this.ETitle = "";
      this.Eid = "";
      this.Ename = "";
      this.PageId = "";
      this.EPageId = "";
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
      filename = "Res/E1PageGenerator/dat_files/" + path.normalize(filename);
      fs.writeFileSync(filename, content);
    },
    add() {
      if (this.type == "AppId") {
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
      } else {
        T[i] =
          "@" +
          this.options[j] +
          ":" +
          this.type +
          "=" +
          this.id +
          "|Version=" +
          this.Version +
          ":" +
          this.name +
          ":" +
          "runE1App" +
          "('" +
          this.id +
          "','" +
          "promptForDS" +
          "','" +
          this.Version +
          "')" +
          "\n";
      }

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
