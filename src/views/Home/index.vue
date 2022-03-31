<template>
  <div id="contianer" class="contianer">
    <div class="header"></div>

    <div>
      <el-upload
        action=""
        class="upload-demo"
        :http-request="addLSJson.bind(this, lsData)"
        :show-file-list="false"
        style="display: inline; margin: 0 10px"
      >
        <el-button type="primary" size="mini">导入整体布局JSON数据 </el-button>
      </el-upload>
      <el-button
        type="primary"
        size="mini"
        @click="exportSettingFile('wholeSetting', lsData)"
        >导出整体布局JSON数据
      </el-button>
      <el-button type="primary" size="mini" @click="addLsShow">新增 </el-button>
      <el-button type="primary" size="mini" @click="editStatus = !editStatus"
        >开启编辑</el-button
      >
      <!-- <el-button type="primary" size="mini" @click="addLsShow">隐藏 </el-button> -->
    </div>
    <hr />
    <div>
      <div @drag="drag" @dragend="dragend" class="droppable-element" draggable="true"
             unselectable="on">Droppable Element (Drag me!)</div>
    
    </div>
    <hr />
    <el-tabs
      class="tabsClass"
      v-model="tabsValue"
      type="card"
      closable
      editable
      @edit="handleTabsEdit"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane
        v-for="(item, index) in lsTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <grid-layout
          :layout.sync="lsData"
          :col-num="12"
          :row-height="50"
          :is-draggable="editStatus"
          :is-resizable="editStatus"
          :vertical-compact="true"
          :use-css-transforms="true"
          :auto-size="true"
          @layout-updated="layoutUpdatedEvent"
        >
          <grid-item
            v-for="ls in lsData"
            :x="ls.x"
            :y="ls.y"
            :w="ls.w"
            :h="ls.h"
            :i="ls.i"
            :key="ls.i"
          >
            <div
              class="landscape"
              :style="{
                'flex-direction': ls.direction == 1 ? 'row' : 'column',
              }"
            >
              <div
                class="main-title-box"
                :style="{
                  'flex-direction': ls.direction == 1 ? 'column' : 'row',
                  background: ls.titleBgColor,
                }"
              >
                <div class="plus">
                  <el-popover placement="bottom-end" trigger="hover">
                    <div class="pop-list">
                      <div class="list-item" @click="editGridShow(ls)">
                        编辑标题
                      </div>
                      <div
                        class="list-item"
                        @click="openAddGridDialog(ls.grids)"
                      >
                        新建
                      </div>
                      <div class="list-item" @click="exportToPng(ls.i)">
                        导出内容为png
                      </div>
                      <el-upload
                        action=""
                        class="upload-demo"
                        :http-request="addLSJson.bind(this, ls.grids)"
                        :show-file-list="false"
                      >
                        <div class="list-item">导入内容</div>
                      </el-upload>
                      <div
                        class="list-item"
                        @click="exportSettingFile(ls.title, ls.grids)"
                      >
                        导出内容
                      </div>
                      <div class="list-item" @click="changeDirection(ls)">
                        切换方向
                      </div>
                      <el-popover placement="top" width="160">
                        <p>确定删除？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text">取消</el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="deleteArrayItem(ls, lsData)"
                            >确定</el-button
                          >
                        </div>
                        <div class="list-item" slot="reference">删除</div>
                      </el-popover>
                    </div>
                    <i class="el-icon-plus" slot="reference"></i>
                  </el-popover>
                </div>
                <div
                  class="title-text"
                  :style="
                    ls.direction == 1 &&
                    'writing-mode: vertical-rl;transform: rotate(180deg);margin:30px 10px;'
                  "
                >
                  {{ ls.title }}
                </div>
              </div>
              <div
                :id="ls.i"
                :ref="ls.i"
                class="container"
                :style="{ background: ls.contentBgColor }"
              >
                <grid-layout
                  :layout.sync="ls.grids"
                  :col-num="150"
                  :row-height="5"
                  :min-height="1"
                  :is-draggable="editStatus"
                  :is-resizable="editStatus"
                  :vertical-compact="true"
                  :use-css-transforms="true"
                  :auto-size="true"
                  @layout-updated="layoutUpdatedEvent"
                >
                  <grid-item
                    v-for="grid in ls.grids"
                    :x="grid.x"
                    :y="grid.y"
                    :w="grid.w"
                    :h="grid.h"
                    :i="grid.i"
                    :key="grid.i"
                  >
                    <div class="ls-item" style="height: 100%">
                      <div class="main">
                        <div class="plus" style="top: 5px; left: 5px">
                          <div style="position: relative">
                            <el-popover placement="bottom-end" trigger="hover">
                              <div class="pop-list">
                                <div
                                  class="list-item"
                                  @click="editGridShow(grid)"
                                >
                                  编辑标题
                                </div>
                                <div
                                  class="list-item"
                                  @click="openAddImageDialog(grid.gridItems)"
                                >
                                  手动添加
                                </div>
                                <div
                                  class="list-item"
                                  @click="exportToPng(grid.i)"
                                >
                                  导出内容为png
                                </div>
                                <el-upload
                                  action=""
                                  class="upload-demo"
                                  :http-request="
                                    addLSJson.bind(this, grid.gridItems)
                                  "
                                  :show-file-list="false"
                                >
                                  <div class="list-item">导入内容</div>
                                </el-upload>
                                <div
                                  class="list-item"
                                  @click="
                                    exportSettingFile(
                                      grid.title,
                                      grid.gridItems
                                    )
                                  "
                                >
                                  导出内容
                                </div>
                                <div
                                  class="list-item"
                                  @click="changeDirection(grid)"
                                >
                                  切换方向
                                </div>
                                <el-popover placement="top" width="160">
                                  <p>确定删除？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text"
                                      >取消</el-button
                                    >
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteArrayItem(grid, ls.grids)"
                                      >确定</el-button
                                    >
                                  </div>
                                  <div class="list-item" slot="reference">
                                    删除
                                  </div>
                                </el-popover>
                              </div>
                              <i class="el-icon-plus" slot="reference"></i>
                            </el-popover>
                          </div>
                        </div>
                        <div
                          :id="grid.i"
                          :ref="grid.i"
                          class="item-content"
                          :style="{ background: grid.contentBgColor }"
                        >
                          <grid-layout
                            :layout.sync="grid.gridItems"
                            :col-num="150"
                            :row-height="5"
                            :min-height="1"
                            :is-draggable="editStatus"
                            :is-resizable="editStatus"
                            :vertical-compact="true"
                            :use-css-transforms="true"
                            :auto-size="true"
                            @layout-updated="layoutUpdatedEvent"
                          >
                            <grid-item
                              v-for="gridItem in grid.gridItems"
                              :x="gridItem.x"
                              :y="gridItem.y"
                              :w="gridItem.w"
                              :h="gridItem.h"
                              :i="gridItem.i"
                              :key="gridItem.i"
                            >
                              <span
                                v-show="editStatus"
                                style="
                                  position: absolute;
                                  left: 2px;
                                  top: 0;
                                  cursor: pointer;
                                "
                              >
                                <el-popover
                                  placement="bottom-end"
                                  trigger="hover"
                                >
                                  <div class="pop-list">
                                    <div
                                      class="list-item"
                                      @click="changeImageFormat(gridItem)"
                                    >
                                      切换样式
                                    </div>
                                    <div
                                      class="list-item"
                                      @click="changeItemBorder(gridItem)"
                                    >
                                      {{
                                        gridItem.border == 1
                                          ? "隐藏边框"
                                          : "显示边框"
                                      }}
                                    </div>
                                    <div
                                      class="list-item"
                                      @click="changeItemShadow(gridItem)"
                                    >
                                      {{
                                        gridItem.shadow == 1
                                          ? "隐藏阴影"
                                          : "显示阴影"
                                      }}
                                    </div>
                                    <div v-if="gridItem.itemType == 2">
                                      <div
                                        class="list-item"
                                        @click="changeItemDirection(gridItem)"
                                      >
                                        切换方向
                                      </div>
                                      <div class="list-item">
                                        <div>
                                          <div>内容</div>
                                          <el-input
                                            clearable
                                            class="input"
                                            size="mini"
                                            style="margin: 0 5px"
                                            v-model="gridItem.name"
                                            @blur="saveLsData"
                                          ></el-input>
                                        </div>
                                      </div>

                                      <div class="list-item">
                                        <div>
                                          <div>背景颜色</div>
                                          <el-input
                                            clearable
                                            class="input"
                                            size="mini"
                                            style="margin: 0 5px"
                                            v-model="gridItem.bgColor"
                                            @blur="saveLsData"
                                          ></el-input>
                                        </div>
                                      </div>
                                      <div class="list-item">
                                        <div>
                                          <div>字体颜色</div>
                                          <el-input
                                            clearable
                                            class="input"
                                            size="mini"
                                            style="margin: 0 5px"
                                            v-model="gridItem.fontColor"
                                            @blur="saveLsData"
                                          ></el-input>
                                        </div>
                                      </div>
                                      <div class="list-item">
                                        <div>
                                          <div>字体</div>
                                          <el-button
                                            style="padding: 5px 8px"
                                            size="mini"
                                            type="success"
                                            @click="
                                              changeFontSize(gridItem, -2)
                                            "
                                            >-</el-button
                                          >
                                          <el-input
                                            class="input"
                                            size="mini"
                                            style="margin: 0 5px; width: 30px"
                                            v-model="gridItem.fontSize"
                                            @blur="saveLsData"
                                          ></el-input>
                                          <el-button
                                            style="padding: 5px 8px"
                                            size="mini"
                                            type="success"
                                            @click="changeFontSize(gridItem, 2)"
                                            >+</el-button
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <i class="el-icon-plus" slot="reference"></i>
                                </el-popover>
                              </span>
                              <span
                                v-show="editStatus"
                                class="remove"
                                @click="removeItem(gridItem.i, grid.gridItems)"
                                >x</span
                              >
                              <div
                                class="content"
                                :style="{
                                  border: gridItem.border == 0 ? 'none' : '',
                                  'box-shadow':
                                    gridItem.shadow == 1
                                      ? 'rgba(0, 0, 0, 0.2) 0px 4px 8px 0px,rgba(0, 0, 0, 0.2) 0px 6px 20px 0px'
                                      : '',
                                }"
                              >
                                <div
                                  v-if="gridItem.itemType == 1"
                                  :key="gridItem.name"
                                  class="grid-big"
                                >
                                  <div
                                    class="box"
                                    :style="{ background: gridItem.color }"
                                  >
                                    <img
                                      crossOrigin="Anonymous"
                                      :src="gridItem.src"
                                      :alt="gridItem.name"
                                    />
                                    <div class="img-title">
                                      {{ gridItem.name }}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  v-else-if="gridItem.itemType == 0"
                                  :key="gridItem.name"
                                  class="grid"
                                >
                                  <img
                                    height="48"
                                    width="48"
                                    crossOrigin="Anonymous"
                                    :src="gridItem.src"
                                    :alt="gridItem.name"
                                  />
                                </div>
                                <div
                                  class="text-item"
                                  :style="{
                                    background: gridItem.bgColor,
                                  }"
                                  v-else
                                >
                                  <div
                                    :style="{
                                      color: gridItem.fontColor,
                                      'font-size': gridItem.fontSize
                                        ? gridItem.fontSize + 'px'
                                        : '',
                                      'writing-mode':
                                        gridItem.direction &&
                                        gridItem.direction != 0
                                          ? 'vertical-rl'
                                          : '',
                                      transform:
                                        gridItem.direction == 2
                                          ? 'rotate(180deg)'
                                          : '',
                                    }"
                                  >
                                    {{ gridItem.name }}
                                  </div>
                                </div>
                              </div>
                            </grid-item>
                          </grid-layout>
                          <!-- <template v-for="gridItem in grid.gridItems"> </template> -->
                        </div>
                      </div>
                    </div>
                  </grid-item>
                </grid-layout>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="手动添加"
      :visible.sync="addImageDialog.dialogVisible"
      width="80%"
      @closed="clearAddImageDialog"
    >
      <el-form
        ref="searchForm"
        :inline="true"
        :rules="rules"
        :model="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="关键字">
          <el-input
            class="input-new-tag"
            v-model="inputValue"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
            <el-tag
              slot="prepend"
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="searchSvg"
          ></el-button>
        </el-form-item>
        <el-form-item label="">
          <el-upload
            action=""
            class="upload-demo"
            :http-request="importToSelected.bind(this, addImageDialog.tempArr)"
            :show-file-list="false"
          >
            <el-button type="primary"
              >导入json，格式[{"name":"","src":""}]</el-button
            >
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="活动区域">
        </el-form-item> -->
      </el-form>
      <div class="center">
        <div style="width: 53%">
          <div
            style="
              max-height: 600px;
              overflow: auto;
              display: flex;
              flex-wrap: wrap;
              padding-right: 0px;
            "
          >
            <div
              style="padding: 20px"
              v-for="item in resultArray"
              :key="item.src"
            >
              <img
                v-if="!item.itemType"
                :src="item.src"
                class="image"
                :alt="item.name"
                @click="addToSelected(item)"
              />
              <div @click="addToSelected(item)" class="text-item" v-else>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div style="width: 40%">
          <div
            style="
              max-height: 600px;
              overflow: auto;
              display: flex;
              flex-wrap: wrap;
              padding-right: 0px;
            "
          >
            <div
              style="padding: 20px"
              v-for="item in addImageDialog.selected"
              :key="item.src"
            >
              <img
                v-if="!item.itemType"
                :src="item.src"
                class="image"
                :alt="item.name"
                @click="deleteFromSelected(item)"
              />
              <div class="text-item" v-else @click="deleteFromSelected(item)">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addImageDialog.dialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addImageConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="addGridDialog.title"
      :visible.sync="addGridDialog.dialogVisible"
      width="40%"
      @closed="clearGridDialog"
    >
      <el-form
        style="width: 80%"
        ref="addGridDialogForm"
        :model="addGridDialog"
        label-width="80px"
      >
        <el-form-item label="标题">
          <el-input v-model="addGridDialog.inputValue"></el-input>
        </el-form-item>
        <el-form-item label="标题背景颜色">
          <el-input v-model="addGridDialog.titleBgColor"></el-input>
        </el-form-item>
        <el-form-item label="内容背景颜色">
          <el-input v-model="addGridDialog.contentBgColor"></el-input>
        </el-form-item>
        <el-form-item
          ><span>
            <el-button @click="addGridDialog.dialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="addGrid">确 定</el-button>
          </span></el-form-item
        >
      </el-form>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="addTabDialog.dialogVisible"
      width="30%"
    >
      <el-form
        :model="addTabDialog.addTabForm"
        :rules="addTabDialog.rules"
        ref="addTabForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="title">
          <el-input v-model="addTabDialog.addTabForm.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTabDialog.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLsTab">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/api";
import axios from "axios";
import VueGridLayout from "vue-grid-layout";
import { v4 as uuid } from "uuid";
import html2canvas from "html2canvas";
import canvas2image from "@/utils/canvas2image";
export default {
  data() {
    return {
      editStatus: false,
      addTabDialog: {
        dialogVisible: false,
        addTabForm: {
          title: "",
        },
        rules: {
          name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        },
      },
      addImageDialog: {
        currentArray: [],
        dialogVisible: false,
        keyword: "",
        selected: [],
        tempArr: [],
      },
      addGridDialog: {
        inputValue: "",
        titleBgColor: "",
        contentBgColor: "",
        dialogVisible: false,
        grids: [],
        grid: {},
        title: "新增父", //新增子
      },
      size: "medium",
      searchForm: {
        keyword: "o",
      },
      resultArray: [],
      ruleForm: {
        amadeusId: "",
        amadeusSecret: "",
        fromEmail: "",
        fromEmailPass: "",
        toEmail: "",
        maxTime: "",
        sleepLength: "",
      },
      rules: {},

      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      width: 700,
      lsData: [],
      defaultLsData: [
        {
          x: 1,
          y: 0,
          w: 4,
          h: 7,
          i: "App Definition and Development",
          direction: 0,
          title: "App Definition and Development",
          titleBgColor: "",
          contentBgColor: "",
          grids: [
            {
              x: 0,
              y: 0,
              w: 85,
              h: 14,
              i: "Kubernetes Kubernetes",
              title: "Kubernetes Kubernetes",
              titleBgColor: "",
              contentBgColor: "",
              direction: 0,
              gridItems: [
                {
                  x: 4,
                  y: 0,
                  w: 106,
                  h: 6,
                  i: "Apache CarbonData1",
                  itemType: 1,
                  color: "rgb(24, 54, 114)",
                  size: 2,
                  fontSize: 22,
                  name: "Apache CarbonData1",
                  src: "https://landscape.cncf.io/logos/apache-carbon-data.svg",
                  moved: false,
                },
              ],
              moved: false,
            },
          ],
          moved: false,
        },
      ],
      lsTabs: [],
      defaultLsTabs: [
        {
          name: "1",
          title: "test1",
        },
        {
          name: "2",
          title: "test2",
        },
      ],
      tabsValue: "1",
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  created() {
    this.getLsTabs();
    this.getLsData();
  },

  watch: {
    // lsData: {
    // handler(newValue, oldValue) {
    // console.log("newVale",newValue);
    // console.log("oldValue",oldValue);
    // localStorage.setItem("lsData", JSON.stringify(newValue));
    //   },
    //   immediate: false,
    //   deep: true,
    // },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    changeFontSize(item, num) {
      if (item.fontSize && item.fontSize + num > 12) {
        item.fontSize += num;
        this.saveLsData();
      }
    },

    getLsData() {
      let lsDataStr = localStorage.getItem(this.tabsValue);
      if (lsDataStr) {
        this.lsData = JSON.parse(lsDataStr);
      } else {
        this.lsData = this.defaultLsData;
      }
    },
    getLsTabs() {
      let lsTabs = JSON.parse(localStorage.getItem("lsTabs"));
      if (lsTabs) {
        this.lsTabs = lsTabs;
      } else {
        this.lsTabs = this.defaultLsTabs;
      }

      let tabsValue = localStorage.getItem("tabsValue");
      if (tabsValue) {
        this.tabsValue = tabsValue;
      }
    },
    addLsTab() {
      this.$refs.addTabForm.validate((valid) => {
        if (valid) {
          let newTabName = uuid();
          this.lsTabs.push({
            title: this.addTabDialog.addTabForm.title,
            name: newTabName,
          });
          this.tabsValue = newTabName;
          this.addTabDialog.dialogVisible = false;
          this.saveLsTabs();
          this.lsData = this.defaultLsData;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleTabsEdit(targetName, action) {
      console.log("action", action);
      if (action === "add") {
        this.addTabDialog.dialogVisible = true;
      }
      if (action === "remove") {
        localStorage.removeItem(targetName);
        let tabs = this.lsTabs;
        let activeName = this.tabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.tabsValue = activeName;
        this.lsTabs = tabs.filter((tab) => tab.name !== targetName);
        this.saveLsTabs();
      }
    },
    handleTabsClick(tab) {
      console.log("currentTab", this.tabsValue);
      localStorage.setItem("tabsValue", this.tabsValue);
      this.getLsData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async searchSvg() {
      this.resultArray = [];

      let resData = await this.readJson("./logo.json");
      this.dynamicTags.forEach((tag) => {
        this.resultArray.push({ itemType: 2, name: tag, src: "" });
      });
      resData.forEach((item) => {
        this.dynamicTags.find((tag) => {
          tag.toString().toLowerCase();
          if (
            item.name.toString().replace("-", "").toLowerCase().includes(tag)
          ) {
            this.resultArray.push(item);
            return true;
          }
        });
      });
      console.log(this.resultArray);
    },
    async readJson(url) {
      let res = await axios.get(url);
      return res.data;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);

      this.searchSvg();
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
      this.searchSvg();
    },

    addLSJson(data, param, outer) {
      if (window.FileReader) {
        let fr = new FileReader();
        console.log("param----", param.file);
        fr.readAsText(param.file);
        fr.onload = (evt) => {
          let newData = JSON.parse(evt.target.result);
          this.changeArray(newData, data);
          console.log("data", data);
          outer(data);
        };
      } else {
        alert("Not supported by your browser!");
      }
    },

    exportSettingFile(name, data) {
      this.exportObjectToFile(name + ".json", data);
    },
    exportObjectToFile(name, obj) {
      var data = JSON.stringify(obj);
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      let a = document.createElement("a");
      a.href = urlObject.createObjectURL(export_blob);
      a.download = name;
      a.click();
    },
    exportToPng(ref) {
      console.log("this.$refs[ref]", this.$refs[ref]);
      html2canvas(this.$refs[ref][0], {
        backgroundColor: "transparent",
        useCORS: "true",
      }).then((canvas) => {
        // let dataURL = canvas.toDataURL("image/png");
        var img = canvas2image.convertToPNG(
          canvas,
          canvas.width,
          canvas.height
        );
        // img.crossOrigin="anonymous";
        let dataURL = img.getAttribute("src");

        let a = document.createElement("a");
        a.href = dataURL;
        a.download = ref;
        a.click();
        document.body.appendChild(canvas);
      });

      // var divContent = document.getElementById(ref).innerHTML;
      // console.log("divContent", divContent);
      // var data =
      //   "data:image/svg+xml," +
      //   "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
      //   "<foreignObject width='100%' height='100%'>" +
      //   "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>" +
      //   divContent +
      //   "</div>" +
      //   "</foreignObject>" +
      //   "</svg>";

      // var img = new Image();
      // img.src = data;
      // document.body.appendChild(img);
      // img.crossOrigin = "anonymous";

      // var canvas = document.createElement("canvas");
      // canvas.width = "500";
      // canvas.height = "500";
      // var ctx = canvas.getContext("2d");
      // // img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
      // ctx.drawImage(img, 0, 0);
      // document.body.appendChild(canvas);

      // var dataURL = canvas.toDataURL();
      // // let dataURL = img.getAttribute("src");
      // let a = document.createElement("a");
      // a.href = dataURL;
      // a.download = ref;
      // a.click();
    },
    addToSelected(item) {
      this.addImageDialog.selected.push({
        itemType: item.itemType ? item.itemType : 0,
        fontSize: 22,
        direction: 0,
        border: 1,
        name: item.name,
        src: item.src,
        x: (this.addImageDialog.currentArray.length * 2) % 12,
        y: this.addImageDialog.currentArray.length + 12, // puts it at the bottom
        w: 2,
        h: 2,
        i: uuid(),
      });
    },
    importToSelected(data, param) {
      this.addLSJson(data, param, () => {
        console.log("this.addImageDialog.tempArr", this.addImageDialog.tempArr);
        this.addImageDialog.tempArr.forEach((item) => {
          this.addImageDialog.selected.push({
            itemType: item.itemType ? item.itemType : 0,
            fontSize: 22,
            direction: 0,
            border: 1,
            name: item.name,
            src: item.src,
            x: (this.addImageDialog.currentArray.length * 2) % 12,
            y: this.addImageDialog.currentArray.length + 12, // puts it at the bottom
            w: 2,
            h: 2,
            i: uuid(),
          });
        });
      });
    },
    deleteFromSelected(item) {
      // this.addImageDialog.selected.shift(item)
      this.deleteArrayItem(item, this.addImageDialog.selected);
    },
    addImageConfirm() {
      this.addArray(
        this.addImageDialog.selected,
        this.addImageDialog.currentArray
      );
      this.saveLsData();
      this.addImageDialog.dialogVisible = false;
    },

    deleteArrayItem(item, arr) {
      arr.find((value, index) => {
        if (value == item) {
          arr.splice(index, 1);
          return true;
        }
      });
    },
    addArray(arr, toArr) {
      arr.forEach((value) => {
        toArr.splice(toArr.length, 0, value);
      });
    },
    changeArray(arr, toArr) {
      arr.forEach((value, index) => {
        toArr.splice(index, 1, value);
      });
    },
    log(name, obj) {
      console.log(name, obj);
    },
    changeDirection(data) {
      data.direction = data.direction == 0 ? 1 : 0;
      // console.log("direction-", data.direction);
    },
    changeSize(data) {
      if (data.size < 6) {
        data.size++;
      } else {
        data.size = 1;
      }
    },
    openAddGridDialog(grids) {
      this.addGridDialog.title = "新增子";
      this.addGridDialog.grids = grids;

      this.addGridDialog.dialogVisible = true;
    },
    editGridShow(item) {
      this.addGridDialog.title = "编辑";
      this.addGridDialog.grid = item;
      this.addGridDialog.inputValue = item.title;
      this.addGridDialog.titleBgColor = item.titleBgColor;
      this.addGridDialog.contentBgColor = item.contentBgColor;

      this.addGridDialog.dialogVisible = true;
    },
    addLsShow() {
      this.addGridDialog.title = "新增父";

      this.addGridDialog.dialogVisible = true;
    },

    addGrid() {
      if (this.addGridDialog.title == "新增子") {
        this.addGridDialog.grids.push({
          title: this.addGridDialog.inputValue,
          titleBgColor: this.addGridDialog.titleBgColor,
          contentBgColor: this.addGridDialog.contentBgColor,
          direction: 1,
          gridItems: [],
          x: (this.addGridDialog.grids.length * 2) % 12,
          y: this.addGridDialog.grids.length + 12, // puts it at the bottom
          w: 2,
          h: 5,
          i: uuid(),
        });
      } else if (this.addGridDialog.title == "新增父") {
        this.lsData.push({
          title: this.addGridDialog.inputValue,
          titleBgColor: this.addGridDialog.titleBgColor,
          contentBgColor: this.addGridDialog.contentBgColor,
          direction: 1,
          grids: [],
          x: (this.lsData.length * 2) % 12,
          y: this.lsData.length + 12, // puts it at the bottom
          w: 2,
          h: 5,
          i: uuid(),
        });
      } else if (this.addGridDialog.title == "编辑") {
        console.log("this.addGridDialog.grid", this.addGridDialog.grid);
        this.addGridDialog.grid.title = this.addGridDialog.inputValue;
        this.addGridDialog.grid.titleBgColor = this.addGridDialog.titleBgColor;

        this.addGridDialog.grid.contentBgColor =
          this.addGridDialog.contentBgColor;

        this.saveLsData();
      }
      this.addGridDialog.dialogVisible = false;

      // uuid(),
    },
    openAddImageDialog(arr) {
      this.addImageDialog.dialogVisible = true;
      this.addImageDialog.currentArray = arr;
      console.log("openAddImageDialog", this.addImageDialog.currentArray);
    },
    layoutUpdatedEvent() {
      // console.log("update");
      this.saveLsData();
    },
    saveLsData() {
      localStorage.setItem(this.tabsValue, JSON.stringify(this.lsData));
    },
    saveLsTabs() {
      localStorage.setItem("lsTabs", JSON.stringify(this.lsTabs));
    },
    clearGridDialog() {
      this.addGridDialog = {
        inputValue: "",
        titleBgColor: "",
        contentBgColor: "",
        dialogVisible: false,
        grids: [],
        grid: {},
        title: "新增父", //新增子
      };
    },
    clearAddImageDialog() {
      this.addImageDialog = {
        currentArray: [],
        dialogVisible: false,
        keyword: "",
        selected: [],
        tempArr: [],
      };
    },
    removeItem(val, arr) {
      const index = arr.map((item) => item.i).indexOf(val);
      arr.splice(index, 1);
    },
    changeImageFormat(gridItem) {
      gridItem.itemType = ++gridItem.itemType < 3 ? gridItem.itemType : 0;
      console.log("gridItem.itemType", gridItem.itemType);
      this.saveLsData();
    },
    changeItemDirection(gridItem) {
      gridItem.direction = ++gridItem.direction < 3 ? gridItem.direction : 0;
      console.log("gridItem.direction", gridItem.direction);
      this.saveLsData();
    },
    changeItemBorder(gridItem) {
      gridItem.border = gridItem.border == 0 ? 1 : 0;
      this.saveLsData();
    },
    changeItemShadow(gridItem) {
      gridItem.shadow = gridItem.shadow == 0 ? 1 : 0;
      this.saveLsData();
    },
    drag(e) {
      let parentRect = document
        .getElementById("item-content")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: "drop",
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = "none";
        } catch {}
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          this.layout = this.layout.filter((obj) => obj.i !== "drop");
        }
      }
    },
    dragend(e) {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        alert(
          `Dropped element props:\n${JSON.stringify(
            DragPos,
            ["x", "y", "w", "h"],
            2
          )}`
        );
        this.$refs.gridlayout.dragEvent(
          "dragend",
          "drop",
          DragPos.x,
          DragPos.y,
          1,
          1
        );
        this.layout = this.layout.filter((obj) => obj.i !== "drop");
        // UNCOMMENT below if you want to add a grid-item
        /*
                this.layout.push({
                    x: DragPos.x,
                    y: DragPos.y,
                    w: 1,
                    h: 1,
                    i: DragPos.i,
                });
                this.$refs.gridLayout.dragEvent('dragend', DragPos.i, DragPos.x,DragPos.y,1,1);
                try {
                    this.$refs.gridLayout.$children[this.layout.length].$refs.item.style.display="block";
                } catch {
                }
                */
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contianer {
  padding: 0 100px;
  height: 2000px;
  width: 2000px;
}
.header {
  width: 100%;
  padding-top: 50px;
  /* text-align: center; */
}
.header-item {
  margin: 10px;
}
.center {
  display: flex;
  .image {
    cursor: pointer;
    width: 60px;
    height: 40px;

    border-radius: 2px;
    padding: 1px;
    visibility: visible;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  /* width: 90px; */
  /* margin-left: 10px;
  vertical-align: bottom; */
}
.input-new-tag >>> .el-input-group__prepend {
  background-color: #fff;
  padding: 0px 5px;
}

.landscape {
  height: 100%;
  width: 100%;
  // width: auto;
  // height: auto;

  box-sizing: border-box;
  position: relative;
  margin: 10px 0px;
  display: flex;
  border: 1px solid rgb(109, 61, 143);
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  letter-spacing: 0.01071em;
  flex-direction: column;
  .main-title-box {
    // width: auto;
    // height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    background: rgb(109, 61, 143);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px,
      rgba(0, 0, 0, 0.2) 0px 6px 20px 0px;
    // position: relative;
    .plus {
      // border: 1px solid rgb(9, 243, 224);
      color: black;
    }
    .title-text {
      // border: 1px solid blue;
      line-height: 1.1;
      font-size: 14px;
      color: #ffffff;
      background: none;
      margin: 10px 30px;
    }
  }
  .container {
    // border: 1px solid red;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px,
      rgba(0, 0, 0, 0.2) 0px 6px 20px 0px;
    // border: 1px solid rgb(6, 253, 253);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .ls-item {
      height: 100%;
      width: 100%;
      position: relative;
      // border: 1px solid green;
      padding: 1px;
      box-sizing: border-box;
      display: flex;

      .main {
        box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px,
          rgba(0, 0, 0, 0.2) 0px 6px 20px 0px;
        margin-right: 8px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        .plus {
          // border: 1px solid rgb(9, 243, 224);
          color: black;
          position: absolute;
          position: relative;
        }
        .item-content {
          width: 100%;
          height: 100%;
          padding: 10px;
          overflow: visible;
          box-sizing: border-box;
          .content {
            border: 1px solid grey;
            border-radius: 2px;
            width: 100%;
            height: 100%;
          }
          .grid {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;

            img {
              cursor: pointer;
              width: 100%;
              height: 100%;
              background-size: contain;
              padding: 1px;
              visibility: visible;
            }
          }
          .grid-big {
            display: flex;
            width: 100%;
            height: 100%;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            align-items: center;
            .box {
              cursor: pointer;
              background: rgb(83, 113, 189);
              visibility: visible;
              width: 100%;
              height: 100%;
              padding: 2px;
              padding-left: 4px;
              box-sizing: border-box;
              .img-title {
                width: 100%;
                height: 13px;
                margin-bottom: 10px;
                text-align: center;
                vertical-align: middle;
                color: white;
                font-size: 6.7px;
                line-height: 11px;
                font-weight: 550;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              img {
                cursor: pointer;
                width: calc(100% - 12px);
                height: calc(100% - 27px);
                padding: 5px;
                margin: 2px 2px 0pxf;
                background: #fff;
              }
            }
          }
        }
      }
    }
  }
}
.pop-list {
  box-sizing: border-box;
  text-align: center;
  .list-item {
    padding: 5px 0;
    .input ::v-deep .el-input__inner {
      padding: 0px;
    }
  }
  .list-item:hover {
    background-color: #f5f7fa;
  }
}
.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}
.text-item {
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 1px;
  visibility: visible;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
}
.tabsClass ::v-deep .el-tabs__new-tab {
  float: left;
  margin-right: 10px;
}
.droppable-element {
    width: 150px;
    text-align: center;
    background: #fdd;
    border: 1px solid black;
    margin: 10px 0;
    padding: 10px;
}
</style>