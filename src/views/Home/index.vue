<template>
  <div id="contianer" class="contianer">
    <!-- <hr /> -->
    <el-drawer
      :wrapperClosable="true"
      :destroy-on-close="true"
      :modal="false"
      title="组件库"
      :visible.sync="moduleDrawer"
      direction="rtl"
    >
      <div class="collectionClass">
        <grid-layout
          ref="collection"
          :layout.sync="collections"
          :col-num="dynamicColNum('collection')"
          :row-height="5"
          :min-height="1"
          :vertical-compact="true"
          :use-css-transforms="true"
          :auto-size="true"
          :is-draggable="false"
          :is-resizable="true"
          @layout-updated="saveCollections"
        >
          <grid-item
            v-for="gridItem in collections"
            :x="gridItem.x"
            :y="gridItem.y"
            :w="gridItem.w"
            :h="gridItem.h"
            :i="gridItem.i"
            :key="gridItem.i"
          >
            <span
              v-show="editStatus"
              style="position: absolute; left: 2px; top: 0; cursor: pointer"
            >
              <el-popover placement="bottom-end" trigger="hover">
                <div class="pop-list">
                  <div class="list-item" @click="changeImageFormat(gridItem)">
                    切换样式
                  </div>
                  <div class="list-item" @click="changeItemBorder(gridItem)">
                    {{ gridItem.border == 1 ? "隐藏边框" : "显示边框" }}
                  </div>
                  <div class="list-item" @click="changeItemShadow(gridItem)">
                    {{ gridItem.shadow == 1 ? "隐藏阴影" : "显示阴影" }}
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
                          @click="changeFontSize(gridItem, -2)"
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
              @click="removeItem(gridItem.i, collections)"
              >x</span
            >
            <div
              @drag="drag"
              @dragend="dragend"
              @mousedown="dragClick(gridItem)"
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
                <div class="box" :style="{ background: gridItem.color }">
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
                draggable="true"
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
                      gridItem.direction && gridItem.direction != 0
                        ? 'vertical-rl'
                        : '',
                    transform: gridItem.direction == 2 ? 'rotate(180deg)' : '',
                  }"
                >
                  {{ gridItem.name }}
                </div>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </div>
    </el-drawer>

    <el-drawer
      :wrapperClosable="true"
      :modal="false"
      title="搜索"
      :visible.sync="searchDrawer"
      direction="rtl"
    >
      <div>
        <el-form
          :mydata="searchForm"
          ref="searchForm"
          :inline="true"
          :rules="rules"
          :model="searchForm"
          class="demo-form-inline"
        >
          <el-form-item label="搜索图标">
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
          <!-- <el-form-item label="">
            <el-upload
              action=""
              class="upload-demo"
              :http-request="
                importToSelected.bind(this, addImageDialog.tempArr)
              "
              :show-file-list="false"
            >
              <el-button type="primary"
                >导入json，格式[{"name":"","src":""}]</el-button
              >
            </el-upload>
          </el-form-item> -->
        </el-form>
        <div class="center">
          <div style="width: 53%">
            <div
              style="
                max-height: 200px;
                overflow: auto;
                display: flex;
                flex-wrap: wrap;
                padding-right: 0px;
              "
            >
              <div
                style="padding: 20px"
                v-for="(item, index) in resultArray"
                :key="item.src + index"
                @drag="drag"
                @dragend="dragend"
                @mousedown="dragClick(item)"
              >
                <img
                  v-if="!item.itemType"
                  :src="item.src"
                  class="image"
                  :alt="item.name"
                />
                <div
                  draggable="true"
                  style="border: 1px solid grey"
                  class="text-item"
                  v-else
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- <hr /> -->

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
        :lazy="true"
      >
        <div>
          <el-upload
            action=""
            class="upload-demo"
            :http-request="addLSJson.bind(this, lsData)"
            :show-file-list="false"
            style="display: inline; margin: 0 10px"
          >
            <el-button type="primary" size="mini">导入JSON </el-button>
          </el-upload>
          <el-button
            type="primary"
            size="mini"
            @click="exportSettingFile('wholeSetting', lsData)"
            >导出JSON
          </el-button>
          <el-button type="primary" size="mini" @click="addLsShow"
            >新增画板
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="editStatus = !editStatus"
            >开启编辑</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="moduleDrawer = !moduleDrawer"
            >组件库</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="searchDrawer = !searchDrawer"
            >搜索</el-button
          >
          <!-- <el-button type="primary" size="mini" @click="addLsShow">隐藏 </el-button> -->
        </div>
        <hr />
        <grid-layout
          ref="lsData"
          :layout.sync="lsData"
          :col-num="12"
          :row-height="50"
          :is-draggable="editStatus"
          :is-resizable="editStatus"
          :vertical-compact="true"
          :use-css-transforms="true"
          :auto-size="true"
          @layout-updated="layoutUpdatedEvent()"
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
            <div class="landscape">
              <div style="position: absolute">
                <el-popover placement="bottom-end" trigger="hover">
                  <div class="pop-list">
                    <div class="list-item" @click="addChildArea(ls.grids)">
                      新建区域
                    </div>
                    <div class="list-item">
                      <div>
                        <div>背景颜色</div>
                        <el-input
                          clearable
                          class="input"
                          size="mini"
                          style="margin: 0 5px"
                          v-model="ls.contentBgColor"
                          @blur="saveLsData"
                        ></el-input>
                      </div>
                    </div>
                    <!-- <div class="list-item" @click="exportToPng(ls.i)">
                      导出内容为png
                    </div> -->
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
                      @click="exportSettingFile(ls.i, ls.grids)"
                    >
                      导出内容
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
                  <div v-show="editStatus" class="plus" slot="reference">
                    <i class="el-icon-plus"></i>
                    <!-- <el-button
                      icon="el-icon-plus"
                      size="mini"
                      circle
                    ></el-button> -->
                  </div>
                </el-popover>
              </div>

              <div
                :id="ls.i"
                :ref="ls.i"
                class="container"
                :style="{ background: ls.contentBgColor }"
              >
                <grid-layout
                  :ref="ls.i"
                  :layout.sync="ls.grids"
                  :col-num="dynamicColNum(ls.i)"
                  :row-height="5"
                  :min-height="1"
                  :is-draggable="editStatus"
                  :is-resizable="editStatus"
                  :vertical-compact="true"
                  :use-css-transforms="true"
                  :auto-size="true"
                  @layout-updated="layoutUpdatedEvent(ls.i)"
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
                        <div style="position: absolute">
                          <el-popover placement="bottom-end" trigger="hover">
                            <div class="pop-list">
                              <div class="list-item">
                                <div>
                                  <div>背景颜色</div>
                                  <el-input
                                    clearable
                                    class="input"
                                    size="mini"
                                    style="margin: 0 5px"
                                    v-model="grid.contentBgColor"
                                    @blur="saveLsData"
                                  ></el-input>
                                </div>
                              </div>
                              <!-- <div
                                class="list-item"
                                @click="exportToPng(grid.i)"
                              >
                                导出内容为png
                              </div> -->
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
                                  exportSettingFile(grid.i, grid.gridItems)
                                "
                              >
                                导出内容
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
                            <div
                              v-show="editStatus"
                              class="plus"
                              slot="reference"
                            >
                              <i class="el-icon-plus"></i>
                            </div>
                          </el-popover>
                        </div>

                        <div
                          class="item-content"
                          :style="{ background: grid.contentBgColor }"
                        >
                          <grid-layout
                            :data="grid"
                            :id="grid.i"
                            :ref="grid.i"
                            :layout.sync="grid.gridItems"
                            :col-num="dynamicColNum(grid.i)"
                            :row-height="5"
                            :min-height="1"
                            :is-draggable="editStatus"
                            :is-resizable="editStatus"
                            :vertical-compact="true"
                            :use-css-transforms="true"
                            :auto-size="false"
                            @layout-updated="layoutUpdatedEvent(grid.i)"
                          >
                            <!-- style="border: 1px solid red; height: 100%" -->
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
                                      @click="
                                        copyItem(gridItem, grid.gridItems)
                                      "
                                    >
                                      复制组件
                                    </div>
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
                                            v-model="gridItem.contentBgColor"
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
                                    <el-popover placement="top" width="160">
                                      <p>确定删除？</p>
                                      <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text"
                                          >取消</el-button
                                        >
                                        <el-button
                                          type="primary"
                                          size="mini"
                                          @click="
                                            removeItem(
                                              gridItem.i,
                                              grid.gridItems
                                            )
                                          "
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
                                    :src="gridItem.src"
                                    :alt="gridItem.name"
                                  />
                                </div>
                                <div
                                  class="text-item"
                                  :style="{
                                    background: gridItem.contentBgColor,
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

    <!-- <el-dialog
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
    </el-dialog> -->
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
      title="新建标签页"
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
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
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
          i: uuid(),
          contentBgColor: "",
          grids: [
            {
              x: 0,
              y: 0,
              w: 145,
              h: 16,
              i: "e71ddd9d-9e69-42e0-bdd8-77771e9acc9c",
              contentBgColor: "#f2dcdb",
              gridItems: [
                {
                  itemType: 2,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 9,
                  y: 0,
                  w: 1,
                  h: 12,
                  i: "64fa6b26-423d-456d-8d68-4492c8163ec7",
                  moved: false,
                  contentBgColor: "#4a7ebb",
                },
                {
                  itemType: 2,
                  fontSize: 34,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 1,
                  name: "接入层",
                  src: "",
                  x: 0,
                  y: 0,
                  w: 8,
                  h: 12,
                  i: "ca7d8408-812d-4553-a6fd-94568c4ba90d",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Kong",
                  src: "https://2tjosk2rxzc21medji3nfn1g-wpengine.netdna-ssl.com/wp-content/themes/konghq/assets/img/gradient-logo.svg",
                  x: 35,
                  y: 0,
                  w: 44,
                  h: 11,
                  i: "68ef5120-fd55-405c-8fd2-c2205e376798",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Envoy",
                  src: "https://landscape.cncf.io/logos/envoy.svg",
                  x: 11,
                  y: 0,
                  w: 20,
                  h: 11,
                  i: "de129db8-319b-41ed-9fad-d3426af602f5",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "HAProxy",
                  src: "https://landscape.cncf.io/logos/ha-proxy.svg",
                  x: 105,
                  y: 0,
                  w: 18,
                  h: 11,
                  i: "ae8bd7fd-5723-49e8-98c2-74ee05306031",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "NGINX",
                  src: "https://landscape.cncf.io/logos/nginx.svg",
                  x: 83,
                  y: 0,
                  w: 20,
                  h: 11,
                  i: "e45fa2e7-ec59-455b-bdb7-bf2e16ed3444",
                  moved: false,
                },
              ],
              moved: false,
            },
            {
              contentBgColor: "#f2f2f2",
              direction: 1,
              gridItems: [
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 1,
                  name: "服务层",
                  src: "",
                  x: 0,
                  y: 0,
                  w: 7,
                  h: 14,
                  i: "55b78fa2-00dd-4f3d-a77e-201ca1b19e86",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 28,
                  border: 0,
                  shadow: 0,
                  direction: 0,
                  name: "服务发现",
                  src: "",
                  x: 14,
                  y: 0,
                  w: 14,
                  h: 2,
                  i: "b43b7375-36cd-4c0d-a961-4fa1e5ee5cf3",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 9,
                  y: 0,
                  w: 1,
                  h: 15,
                  i: "6c7a010d-27ab-4ea9-b429-6ba748ec8c22",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 31,
                  y: 0,
                  w: 1,
                  h: 16,
                  i: "431033a6-f1af-4038-902f-a3bc8c30a74b",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Apache Zookeeper",
                  src: "https://landscape.cncf.io/logos/apache-zookeeper.svg",
                  x: 11,
                  y: 2,
                  w: 17,
                  h: 9,
                  i: "aa3f8a73-155d-4b7a-ba24-abb7ffeaabf6",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Nacos",
                  src: "https://landscape.cncf.io/logos/nacos.svg",
                  x: 11,
                  y: 11,
                  w: 19,
                  h: 4,
                  i: "0e04cb5a-6b9c-40a2-9697-4d6fb9849bf2",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 28,
                  border: 0,
                  shadow: 0,
                  direction: 0,
                  name: "服务治理",
                  src: "",
                  x: 32,
                  y: 0,
                  w: 21,
                  h: 3,
                  i: "2c9d7127-0d98-4cac-b7bd-097c66328538",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Sentinel",
                  src: "https://landscape.cncf.io/logos/sentinel.svg",
                  x: 32,
                  y: 3,
                  w: 8,
                  h: 6,
                  i: "62279240-9849-45d1-9d2a-42bc665b2f67",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Apollo",
                  src: "https://landscape.cncf.io/logos/apollo.svg",
                  x: 41,
                  y: 3,
                  w: 12,
                  h: 6,
                  i: "27e0442d-096f-48b4-bd33-baa77bda4cde",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 53,
                  y: 0,
                  w: 1,
                  h: 16,
                  i: "a3e75cbf-9230-4ffd-99d4-9b389cf1b3da",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "SkyWalking",
                  src: "https://landscape.cncf.io/logos/sky-walking.svg",
                  x: 32,
                  y: 9,
                  w: 21,
                  h: 7,
                  i: "a721debc-add0-418f-beb2-5a18f67204a7",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 28,
                  border: 0,
                  shadow: 0,
                  direction: 0,
                  name: "服务调用",
                  src: "",
                  x: 55,
                  y: 0,
                  w: 20,
                  h: 3,
                  i: "e693c7b5-03b9-4350-b519-1fb27f83bc53",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 76,
                  y: 0,
                  w: 1,
                  h: 16,
                  i: "035bd8bd-28e3-4d78-be09-d6b067d5c5de",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "spring",
                  src: "https://spring.io/images/spring-logo-9146a4d3298760c2e7e49595184e1975.svg",
                  x: 55,
                  y: 9,
                  w: 19,
                  h: 7,
                  i: "8e44a037-8d73-487c-909a-ff49ad65446a",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Dubbo",
                  src: "https://landscape.cncf.io/logos/dubbo.svg",
                  x: 55,
                  y: 3,
                  w: 19,
                  h: 6,
                  i: "49f5879b-cfd4-499c-a7be-08ebd40a0187",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 97,
                  y: 0,
                  w: 1,
                  h: 16,
                  i: "8de5f78a-23b0-47b1-9906-51646d613292",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 28,
                  border: 0,
                  shadow: 0,
                  direction: 0,
                  name: "服务监控",
                  src: "",
                  x: 77,
                  y: 0,
                  w: 20,
                  h: 3,
                  i: "0e634163-96f5-41b7-b55f-8731c86ad53e",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 28,
                  border: 0,
                  shadow: 0,
                  direction: 0,
                  name: "服务构建",
                  src: "",
                  x: 98,
                  y: 0,
                  w: 22,
                  h: 3,
                  i: "5268de0f-47dd-4c85-af35-f0627c777f39",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Grafana",
                  src: "https://landscape.cncf.io/logos/grafana.svg",
                  x: 77,
                  y: 3,
                  w: 9,
                  h: 6,
                  i: "a064a190-986b-422f-a2e0-10b8626a29b7",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Prometheus",
                  src: "https://landscape.cncf.io/logos/prometheus.svg",
                  x: 88,
                  y: 3,
                  w: 9,
                  h: 7,
                  i: "6b75e49b-042e-40b5-9e69-8e0acc1517bd",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Elastic",
                  src: "https://landscape.cncf.io/logos/elastic.svg",
                  x: 77,
                  y: 10,
                  w: 20,
                  h: 6,
                  i: "2f7931f2-da63-47e5-9381-a0b1c1741561",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "GitLab",
                  src: "https://landscape.cncf.io/logos/git-lab.svg",
                  x: 100,
                  y: 3,
                  w: 10,
                  h: 7,
                  i: "a7959e53-c694-4f12-8df3-e7375198aae0",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Jenkins",
                  src: "https://landscape.cncf.io/logos/jenkins.svg",
                  x: 110,
                  y: 3,
                  w: 10,
                  h: 7,
                  i: "1d002cd7-6bf0-46f6-a0e4-fe6ef5951e02",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "sonarqube",
                  src: "https://www.sonarqube.org/assets/logo-31ad3115b1b4b120f3d1efd63e6b13ac9f1f89437f0cf6881cc4d8b5603a52b4.svg",
                  x: 100,
                  y: 10,
                  w: 21,
                  h: 5,
                  i: "644ca21b-7124-459a-97be-a4c2d6eb005b",
                  moved: false,
                },
              ],
              x: 0,
              y: 16,
              w: 145,
              h: 17,
              i: "8f6171fa-6cfe-45b0-98a9-c3ae90e4cb35",
              moved: false,
            },
            {
              contentBgColor: "#cfe2e9",
              direction: 1,
              gridItems: [
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 1,
                  name: "数据层",
                  src: "",
                  x: 0,
                  y: 0,
                  w: 7,
                  h: 9,
                  i: "265e4588-688e-49c3-bfde-06331f53ca48",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 8,
                  y: 0,
                  w: 1,
                  h: 9,
                  i: "a5c1ffda-7f8a-42f5-b5ea-da62d9ff3763",
                  moved: false,
                  contentBgColor: "#4a7ebb",
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "MySQL",
                  src: "https://landscape.cncf.io/logos/my-sql.svg",
                  x: 10,
                  y: 0,
                  w: 17,
                  h: 11,
                  i: "ed07d3c4-6e66-40db-9b75-18228551eac3",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Redis",
                  src: "https://landscape.cncf.io/logos/redis.svg",
                  x: 44,
                  y: 0,
                  w: 16,
                  h: 10,
                  i: "49ec54d4-d6e9-4897-8a53-48ab72ed148d",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "ShardingSphere",
                  src: "https://landscape.cncf.io/logos/sharding-sphere.svg",
                  x: 28,
                  y: 0,
                  w: 15,
                  h: 10,
                  i: "f72017a0-7dd2-4bfb-8778-35745e2e556e",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Apache Spark",
                  src: "https://landscape.cncf.io/logos/apache-spark.svg",
                  x: 108,
                  y: 0,
                  w: 14,
                  h: 10,
                  i: "40d6f1a0-2727-4ddf-8c38-deda85f61d79",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Flink",
                  src: "https://landscape.cncf.io/logos/flink.svg",
                  x: 63,
                  y: 0,
                  w: 17,
                  h: 10,
                  i: "bbff6299-bbaf-4b87-a9aa-f77703c4dafb",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Apache Hadoop",
                  src: "https://landscape.cncf.io/logos/apache-hadoop.svg",
                  x: 80,
                  y: 0,
                  w: 28,
                  h: 9,
                  i: "c617a6d3-1086-46f6-a097-8023a4f71f99",
                  moved: false,
                },
              ],
              x: 1,
              y: 33,
              w: 144,
              h: 14,
              i: "1a114fa3-0619-4b07-a96e-1d8a6e6b4668",
              moved: false,
            },
            {
              contentBgColor: "#e6e0ec",
              direction: 1,
              gridItems: [
                {
                  itemType: 2,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 11,
                  y: 0,
                  w: 1,
                  h: 10,
                  i: "054ecc85-2591-4b39-9412-29833d3598b9",
                  moved: false,
                  contentBgColor: "#4a7ebb",
                },
                {
                  itemType: 2,
                  fontSize: 36,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 1,
                  name: "资源层",
                  src: "",
                  x: 0,
                  y: 0,
                  w: 8,
                  h: 11,
                  i: "9da9e06f-2576-4bea-867f-2adfad34ce50",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Kubernetes",
                  src: "https://landscape.cncf.io/logos/kubernetes.svg",
                  x: 14,
                  y: 0,
                  w: 16,
                  h: 11,
                  i: "d6941c4b-66cb-43fa-a84b-cdbd2f308e71",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "containerd",
                  src: "https://landscape.cncf.io/logos/containerd.svg",
                  x: 30,
                  y: 0,
                  w: 12,
                  h: 11,
                  i: "9cf205c5-7e36-4275-a639-c095ccd4df4a",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Harbor",
                  src: "https://landscape.cncf.io/logos/harbor.svg",
                  x: 59,
                  y: 0,
                  w: 13,
                  h: 12,
                  i: "d3d279f0-87ef-4e0c-a8f3-731ff06f5281",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "CoreDNS",
                  src: "https://landscape.cncf.io/logos/core-dns.svg",
                  x: 43,
                  y: 0,
                  w: 15,
                  h: 12,
                  i: "dd4e0731-ec57-4090-abd7-10e1a11b1471",
                  moved: false,
                },
                {
                  itemType: 2,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  contentBgColor: "#4a7ebb",
                  direction: 0,
                  name: "",
                  src: "",
                  x: 73,
                  y: 0,
                  w: 1,
                  h: 10,
                  i: "16ded4a1-72dd-487d-8e8a-0f1d3dc9a383",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Tencent Kubernetes .",
                  src: "https://landscape.cncf.io/logos/tencent-kubernetes-engine-tke.svg",
                  x: 75,
                  y: 0,
                  w: 17,
                  h: 6,
                  i: "eccb4450-4eac-4c4d-bffb-ac78d3a86b5e",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Huawei",
                  src: "https://landscape.cncf.io/logos/huawei.svg",
                  x: 96,
                  y: 0,
                  w: 17,
                  h: 6,
                  i: "c987a208-534e-48ea-a1c8-5f0a5ca5eedc",
                  moved: false,
                },
                {
                  itemType: 0,
                  fontSize: 22,
                  border: 0,
                  shadow: 0,
                  fontColor: "",
                  direction: 0,
                  name: "Alibaba Cloud Conta.",
                  src: "https://landscape.cncf.io/logos/alibaba-cloud-container-service-for-kubernetes.svg",
                  x: 79,
                  y: 6,
                  w: 30,
                  h: 5,
                  i: "943ed665-eff5-4e44-ae7d-9ed78147acd4",
                  moved: false,
                },
              ],
              x: 2,
              y: 47,
              w: 142,
              h: 14,
              i: "57e4fddc-7b49-4f45-bb87-8ac9070e19e2",
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
      currentAboveLayout: [],
      currentAboveId: "",
      mouseInGrid: false,
      searchDiv: {
        inputValue: "",
      },
      dragItem: {},
      collections: [],
      defaultCollections: [
        {
          x: 1,
          y: 0,
          w: 18,
          h: 8,
          i: uuid(),
          itemType: 0,
          fontSize: 22,
          border: 1,
          shadow: 0,
          direction: 0,
          fontColor: "",
          name: "Apache CarbonData1",
          src: "https://landscape.cncf.io/logos/apache-carbon-data.svg",
          moved: false,
        },
      ],
      moduleDrawer: false,
      searchDrawer: false,
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  created() {
    this.getLsTabs();
    this.getLsData();
    this.getCollections();
  },
  computed: {},
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
  mounted() {
    document.addEventListener(
      "dragover",
      function (e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
    // console.log("...........", this);
    // console.log("searchForm...........", this.$refs["searchForm"]);
  },
  beforeDestroy() {},
  methods: {
    dynamicColNum(ref) {
      // console.log("------ref", ref);
      if (this.$refs[ref] && this.$refs[ref] != []) {
        // console.log("------", this.$refs[ref]);
        let el = this.$refs[ref].$el || this.$refs[ref][0].$el;

        if (el) {
          // console.log("走了", el.offsetWidth);
          return el.offsetWidth / 10;
        }
        return 12;
      }
    },
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
    getCollections() {
      let collectionsStr = localStorage.getItem("collections");
      if (collectionsStr) {
        this.collections = JSON.parse(collectionsStr);
      } else {
        this.collections = this.defaultCollections;
        console.log("走了   ");
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
      this.$router.go(0);
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
        w: 30,
        h: 5,
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
            border: 1,
            name: item.name,
            src: item.src,
            x: (this.addImageDialog.currentArray.length * 2) % 12,
            y: this.addImageDialog.currentArray.length + 12, // puts it at the bottom
            w: 30,
            h: 5,
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

    editGridShow(item) {
      this.addGridDialog.title = "编辑";
      this.addGridDialog.grid = item;
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
          w: 20,
          h: 20,
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
    layoutUpdatedEvent(ref) {
      // console.log("update");
      // this.dynamicColNum(ref)
      this.saveLsData();
    },
    saveLsData() {
      localStorage.setItem(this.tabsValue, JSON.stringify(this.lsData));
    },
    saveLsTabs() {
      localStorage.setItem("lsTabs", JSON.stringify(this.lsTabs));
    },
    saveCollections() {
      console.log("dsdfsdfsfd");
      localStorage.setItem("collections", JSON.stringify(this.collections));
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
      console.log("-----------------++++");
      this.mouseInGrid = false;
      // let parentRect = document
      //   .getElementById("item-content")
      //   .getBoundingClientRect();
      let contentDivs = document.getElementsByClassName("item-content");

      let parentRect;
      console.log("-----------------++++", contentDivs);
      contentDivs.forEach((contentDiv) => {
        this.currentAboveId = contentDiv.firstChild.id;
        // console.log("currentAboveId", this.currentAboveId);

        parentRect = contentDiv.getBoundingClientRect();
        if (
          mouseXY.x > parentRect.left &&
          mouseXY.x < parentRect.right &&
          mouseXY.y > parentRect.top &&
          mouseXY.y < parentRect.bottom
        ) {
          this.currentAboveLayout =
            this.$refs[this.currentAboveId][0].$attrs.data.gridItems;
          this.mouseInGrid = true;
          console.log("this.mouseInGrid", this.mouseInGrid);
        }
      });
    },
    dragend(e) {
      if (this.mouseInGrid === true) {
        this.dragItem.x =
          (this.currentAboveLayout.length * 2) % (this.colNum || 12);
        this.dragItem.y = this.currentAboveLayout.length + (this.colNum || 12);
        console.log("this.dragItem", this.dragItem);
        this.currentAboveLayout.push(this.dragItem);
        this.editStatus = true;
      }
    },
    addParentArea(arr) {
      arr.push({
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
      this.editStatus = true;
    },
    addChildArea(arr) {
      arr.push({
        contentBgColor: "",
        direction: 1,
        gridItems: [],
        x: (arr.length * 2) % 12,
        y: arr.length + 12, // puts it at the bottom
        w: 20,
        h: 20,
        i: uuid(),
      });
      this.editStatus = true;
    },
    dragClick(item) {
      console.log("item", item);
      this.dragItem = {
        itemType: item.itemType || 0,
        fontSize: item.fontSize || "",
        border: item.border || 0,
        shadow: item.shadow || 0,
        fontColor: item.bgColor || "",
        bgColor: item.bgColor || "",
        direction: 0,
        name: item.name || "",
        src: item.src || "",
        x: 0,
        y: 999, // puts it at the bottom
        w: item.w || 30,
        h: item.h || 5,
        i: uuid(),
      };
      console.log("this.dragItem", this.dragItem);
    },
    addToCollections(item) {
      this.collections.push({
        itemType: item.itemType,
        fontSize: item.fontSize,
        border: item.border,
        shadow: item.shadow,
        fontColor: item.fontColor,
        direction: item.direction,
        name: item.name,
        src: item.src,
        x: (this.collections.length * 2) % 12,
        y: 0, // puts it at the bottom
        w: 30,
        h: 5,
        i: uuid(),
      });
      this.saveCollections();
    },
    copyItem(item, arr) {
      arr.push({
        itemType: item.itemType,
        fontSize: item.fontSize,
        border: item.border,
        shadow: item.shadow,
        contentBgColor: item.contentBgColor,
        direction: item.direction,
        name: item.name,
        src: item.src,
        x: item.x + item.w,
        y: item.y, // puts it at the bottom
        w: item.w,
        h: item.h,
        i: uuid(),
      });
      console.log("arr----", arr);
    },
  },
};
</script>

<style lang="scss" scoped>
.contianer {
  padding: 0 100px;
  height: 3000px;
  width: 2000px;
}
.header {
  width: 100%;
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
    border: 1px solid grey;
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
  // position: relative;
  margin: 10px 0px;
  display: flex;
  border: 1px solid rgb(109, 61, 143);
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  letter-spacing: 0.01071em;
  flex-direction: column;
  .plus {
    display: inline;
    color: black;
    // position: absolute;
    // position: relative;
    cursor: pointer;
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
        // .plus {
        //   // border: 1px solid rgb(9, 243, 224);
        //   color: black;
        //   // position: absolute;
        //   position: relative;
        //   cursor: pointer;
        // }
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
.collectionClass {
  width: 90%;
  height: 90%;
  padding: 10px;
  overflow: visible;
  border: 1px solid red;
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
</style>