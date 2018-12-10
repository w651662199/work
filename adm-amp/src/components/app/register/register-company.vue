<template>
	<div class="company-content">
		<!--<h1>填写公司信息</h1>
		<h4>(本页所有信息项均为必填项)</h4>-->
		<div class="content-form">
			<div class="form-con no-left">
				<el-form class="common-item" :model="companyForm" :rules="rules" ref="companyFormTop" label-width="110px">
					<el-form-item label="企业类型：">
						<el-radio-group v-model="companyForm.companyNature">
							<el-radio-button :label="2" v-if="userInfo.type == 2 || userInfo.loginFrom == 'GOME_ONLINE'">品牌商</el-radio-button>
							<el-radio-button :label="5" v-if="userInfo.loginFrom == 'GOME_ONLINE'">合作企业</el-radio-button>
							<el-radio-button :label="1" v-if="userInfo.type == 1">POP商家</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="经营品牌：">
						<el-input v-model="brandText" placeholder="搜索品牌" prefix-icon="el-icon-search" style="width: 200px;margin-right: 20px;"></el-input><button class="btn btn-primary" type="button" @click.prevent="search">搜索</button>
						<input type="text" name="" style="visibility: hidden;">
						<div class="showMsg" v-html="selectedMsg"></div>
						<transition name="el-zoom-in-top">
							<div style="padding-top: 6px;" v-if="brands.length != 0">
								<div class="search-option">
									<ul>
										<li v-for="(item, index) in brands" :class="item.checked?'selectedColor':''">
											<el-checkbox style="width:100%;" v-model="item.checked" @change="selectBrand(item)">
												<span class="option-name" style="margin-left: 5px;" :title="item.name">{{item.name}}</span>
												<span class="options-id" :title="item.gomeBrandId">ID：{{item.gomeBrandId}}</span>
											</el-checkbox>
										</li>
									</ul>
								</div>
							</div>
						</transition>
					</el-form-item>
					<el-form-item label="已选经营品牌：" prop="gomeBrandIds">
						<template v-if="selectBrands.length == 0">
							<span style="color:#8a919b;">未选择品牌</span>
						</template>
						<template v-else>
							<div style="padding-top: 6px;">
								<span class="tag-item" v-for="(brand, index) in selectBrands">
									<span class="brandName" :title="brand.name">{{brand.name}}</span>
									<em class="el-icon-close brandClose" @click="removeBrand(index)"></em>
								</span>
							</div>
						</template>
					</el-form-item>
					<el-form-item label="经营品类：" v-if="companyForm.companyNature == 2"></el-form-item>
					<el-form-item label-width="0px" v-if="companyForm.companyNature == 2">
						<el-row>
							<el-col :span="8">
								<el-form-item class="con-box">
									<span class="check-item"
										v-for="category in categoryOne"
										@click="clickCategory(category)"
									>
										{{category.name}}
									</span>
								</el-form-item>
							</el-col>
							<el-col :span="8" v-if="categoryTwo.length > 0">
								<el-form-item class="con-box">
									<span class="check-item"
										v-for="category in categoryTwo"
										@click="clickCategory(category)"
									>
										{{category.name}}
									</span>
								</el-form-item>
							</el-col>
							<el-col :span="8" v-if="categoryThree.length > 0">
								<el-form-item class="con-box">
									<span class="check-item"
										v-for="category in categoryThree"
									>
										<el-checkbox v-model="category.checked" @change="selectCategory(category)"></el-checkbox>
										{{category.name}}
									</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="已选经营品牌：" prop="categorys" v-if="companyForm.companyNature == 2">
						<template v-if="selectCategorys.length == 0">
							<span style="color:#8a919b;">未选择品类</span>
						</template>
						<template v-else>
							<div style="padding-top: 6px;">
								<span class="tag-item" v-for="(category, index) in selectCategorys">
									<span class="brandName" :title="category.name">{{category.name}}</span>
									<em class="el-icon-close brandClose" @click="removeCategory(index)"></em>
								</span>
							</div>
						</template>
					</el-form-item>
				</el-form>
			</div>
			<div class="form-con no-pad" v-if="fromDrawer == 'supplementDrawer' ? false : companyNature != '1'">
				<div class="route-tab">
					<div class="tab-list">
						<div class="tab-item" @click="changeChoiceMethod(1)"><span :class="{'active': companyForm.organization.certificateType == 1}">企业认证</span></div>
						<div class="tab-item" @click="changeChoiceMethod(2)"><span :class="{'active': companyForm.organization.certificateType == 2}">快捷认证</span></div>
					</div>
				</div>
				<p class="gray-text" v-if="companyForm.organization.certificateType == 1">与国美尚未合作的企业，请选择此方式进行认证。</p>
				<p class="gray-text" v-if="companyForm.organization.certificateType == 2">与国美有过商务合作的企业，请选择此方式进行快捷认证。</p>
			</div>
			<div class="form-con" v-if="companyForm.organization.certificateType == 1">
				<div class="licenceType common-item" v-if="companyForm.companyNature != 1">
					<span>证照类型：</span>
					<el-radio-group v-model="companyForm.organization.licenseType" @change="saveLocalData('licenseType', companyForm.organization.licenseType)">
						<el-radio :label="2">多证合一</el-radio>
						<el-radio :label="1">多证分离</el-radio>
					</el-radio-group>
					<div class="licenseTip">{{companyForm.organization.licenseType==1?'多证分离需填写营业执照、组织机构代码证、税务登记证。':'多证合一是指社工商营业执照、组织机构代码证、税务登记证等证件整合为一张“营业执照”。'}}</div>
				</div>
				<div class="formMain is-left common-item clearfix">
					<div class="mainLeft" :class="{'fixedNav':fixedNav}">
						<ul>
							<li v-for="(item, index) in navList" @click="changeForm(index)" :class="{'selected': getSelected(scrollTop, index)}">
								<span>{{item.msg}}</span>
								<em class="icon" :class="[item.iconColor, item.icon]"></em>
							</li>
						</ul>
					</div>
					<div class="mainRight">
						<div class="formItem">
							<el-form :model="companyForm" :rules="rules" ref="companyForm01" label-width="200px">
								<div class="if-item">
									<span>营业执照</span>
								</div>
								<div class="item-unfold">
									<div class="unfold-content" ref="companyLicense">
										<el-form-item label="公司名称：" class="is-required" prop="organization.companyName">
											<el-input v-model="companyForm.organization.companyName" :disabled="!companyNameDisabled" @blur="saveLocalData('companyName', companyForm.organization.companyName)"></el-input>
											<div class="formDefaultTip">需与营业执照上的公司名称完全一致</div>
										</el-form-item>
										<el-form-item label="类型：" v-show="companyForm.organization.licenseType==2" prop="organization.companyType" class="is-required">
											<el-input v-model="companyForm.organization.companyType" :disabled="!companyTypeDisabled" @blur="saveLocalData('companyType', companyForm.organization.companyType)"></el-input>
										</el-form-item>
										<el-form-item label="注册号（营业执照号）：" class="is-required" prop="organization.bizLicenseNumber" v-show="companyForm.organization.licenseType==1">
											<el-input v-model="companyForm.organization.bizLicenseNumber" @blur="saveLocalData('bizLicenseNumber', companyForm.organization.bizLicenseNumber)" :disabled="!bizLicenseNumberDisabled"></el-input>
										</el-form-item>
										<el-form-item label="统一社会信用代码：" v-show="companyForm.organization.licenseType==2" prop="organization.socialCreditCode" class="is-required">
											<el-input v-model="companyForm.organization.socialCreditCode" :disabled="!socialCreditCodeDisabled" @blur="saveLocalData('socialCreditCode', companyForm.organization.socialCreditCode)"></el-input>
											<div class="formGraphic">
												<el-popover placement="right-start" trigger="hover" popper-class="socialCreditCode">
													<img :src="socialCreditCodeSrc"/>
													<a slot="reference" href="javascript:;">营业执照统一社会信用代码图示</a>
												</el-popover>
											</div>
										</el-form-item>
										<el-form-item label="法人代表姓名：" class="is-required" prop="organization.legalReprName" >
											<el-input v-model="companyForm.organization.legalReprName" @blur="saveLocalData('legalReprName', companyForm.organization.legalReprName)" :disabled="!legalReprNameDisabled"></el-input>
										</el-form-item>
										<el-form-item label="法人代表身份证号：" class="is-required" prop="organization.legalReprIdNumber" >
											<el-input v-model="companyForm.organization.legalReprIdNumber" @blur="saveLocalData('legalReprIdNumber', companyForm.organization.legalReprIdNumber)" :disabled="!legalReprIdNumberDisabled"></el-input>
										</el-form-item>
										<el-form-item label="法人身份证电子版：" class="is-required"  >
											<el-form-item prop="organization.legalReprIdImage" style="margin-bottom: 22px;" :error="imgErrorMsg.legalReprIdImage">
												<el-upload style="margin-bottom: 10px;" class="detail-row" :action="uploadUrl" accept="image/jpg,image/jpeg,image/png" :disabled="!legalReprIdImageDisabled"
													:multiple="false" :on-success="handleLegalReprIdImageSuccess" :show-file-list="false" :before-upload="beforeLegalReprIdImageUpload">
													<div class="btn btn-primary" :class="{'disabled':!legalReprIdImageDisabled}">上传正面</div>
													<span slot="tip" class="el-upload__tip text-gray">（身份证正面照）</span>
												</el-upload>
												<div class="showLegalReprId" v-show="companyForm.organization.legalReprIdImage!=''">
													<img :src="companyForm.organization.legalReprIdImage">
												</div>
											</el-form-item>
											<el-form-item prop="organization.legalReprIdBackImage" :error="imgErrorMsg.legalReprIdBackImage">
												<el-upload style="margin-bottom: 10px;" class="detail-row" :action="uploadUrl" accept="image/jpg,image/jpeg,image/png"  :disabled="!legalReprIdBackImageDisabled"
													:multiple="false" :on-success="handleLegalReprIdBackImageSuccess" :show-file-list="false" :before-upload="beforeLegalReprIdBackImageUpload">
													<div class="btn btn-primary" :class="{'disabled':!legalReprIdBackImageDisabled}">上传反面</div>
													<span slot="tip" class="el-upload__tip text-gray">（身份证反面照）</span>
												</el-upload>
												<div class="showLegalReprId" v-show="companyForm.organization.legalReprIdBackImage!=''">
													<img :src="companyForm.organization.legalReprIdBackImage">
												</div>
												<p class="text-gray">请提供原件彩色扫描件或拍照件。</p>
												<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
											</el-form-item>
										</el-form-item>
										<el-form-item label="营业执照详细地址：" class="is-required">
											<el-form-item label="省份" label-width="55px" style="display: inline-block;margin-bottom: 22px;" prop="organization.bizLicenseProvince">
							                    <el-select v-model="companyForm.organization.bizLicenseProvince" @change="saveLocalData('bizLicenseProvince', companyForm.organization.bizLicenseProvince)" :disabled="!bizLicenseProvinceDisabled" placeholder="请选择" style="width:140px;">
							                      	<el-option v-for="(item, index) in regionData" :key="item.zip" :label="item.name" :value="item.name" style="padding: 0;">
							                        	<li style="padding: 8px 10px;"  @click="applyInnerCityLicense(index)">{{item.name}}</li>
							                      	</el-option>
							                    </el-select>
						                    </el-form-item>
						                    <el-form-item label="城市" label-width="80px" style="display: inline-block;margin-bottom: 22px;" prop="organization.bizLicenseCity">
							                    <el-select v-model="companyForm.organization.bizLicenseCity" @change="saveLocalData('bizLicenseCity', companyForm.organization.bizLicenseCity)" placeholder="请选择" style="width:140px;" :disabled="!bizLicenseCityDisabled">
							                      	<el-option v-for="item in licenseCity" :key="item.zip" :label="item.name" :value="item.name"></el-option>
							                    </el-select>
						                    </el-form-item>
						                    <el-form-item label="详细地址" label-width="83px" prop="organization.bizLicenseAddress">
						                    	<el-input v-model="companyForm.organization.bizLicenseAddress" @blur="saveLocalData('bizLicenseAddress', companyForm.organization.bizLicenseAddress)" style="width:336px;" :disabled="!bizLicenseAddressDisabled"></el-input>
						                    </el-form-item>
										</el-form-item>
										<el-form-item label="邮编：" prop="organization.bizLicensePostcode" class="is-required">
											<el-input v-model="companyForm.organization.bizLicensePostcode" @blur="saveLocalData('bizLicensePostcode', companyForm.organization.bizLicensePostcode)" :disabled="!bizLicensePostcodeDisabled"></el-input>
										</el-form-item>
										<el-form-item label="成立日期：" class="is-required" prop="companyFoundDate">
											<el-date-picker type="date" placeholder="选择成立日期" :editable="false"
															v-model="companyFoundDate" style="width: 420px;" :disabled="!companyFoundDateDisabled">
											</el-date-picker>
										</el-form-item>
										<el-form-item label="营业期限：" class="is-required" prop="bizDate">
											<el-col :span="11" style="width: 194px">
													<el-date-picker type="date" :editable="false" placeholder="选择营业开始日期"
																	v-model="bizStartDate" style="width: 100%;" :disabled="!bizStartDateDisabled">
													</el-date-picker>
											</el-col>
											<el-col class="line" style="margin: 0px 11px;width: 10px;text-align: center;">-</el-col>
											<el-col :span="11" style="width: 194px">
													<el-date-picker type="date" :editable="false" placeholder="选择营业结束日期"
																	v-model="bizEndDate" style="width: 100%;" :disabled="!bizEndDateDisabled">
													</el-date-picker>
											</el-col>
										</el-form-item>
										<el-form-item label="注册资本：" class="is-required">
											<el-col :span="11" style="width: 380px">
												<el-form-item prop="organization.regCapital">
													<el-input v-model="companyForm.organization.regCapital" @blur="saveLocalData('regCapital', companyForm.organization.regCapital)" style="width: 380px" :disabled="!regCapitalDisabled"></el-input>
												</el-form-item>
											</el-col>
											<el-col class="line" :span="2"style="width: 38px;padding-left: 10px">万元</el-col>
										</el-form-item>
										<el-form-item label="经营范围：" class="is-required" prop="organization.bizScope">
											<el-input type="textarea" v-model="companyForm.organization.bizScope" @blur="saveLocalData('bizScope', companyForm.organization.bizScope)" :disabled="!bizScopeDisabled"></el-input>
										</el-form-item>
										<el-form-item label="营业执照副本电子版：" class="is-required" prop="organization.bizLicenseImage" :error="imgErrorMsg.bizLicenseImage">
											<el-upload :action="uploadUrl" accept="image/jpg,image/jpeg,image/png" :disabled="!bizLicenseImageDisabled"
												:multiple="false" :on-success="handleBizLicenseImageSuccess" :show-file-list="false" :before-upload="beforeBizLicenseImageUpload">
												<div class="btn btn-primary" :class="{'disabled':!bizLicenseImageDisabled}">上传营业执照副本</div>
												<div slot="tip" class="el-upload__tip">
													<p class="text-gray">请提供加盖企业红色公章的电子版或原件彩色扫描件或拍照件。</p>
													<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
												</div>
											</el-upload>
											<div class="showBizLicenseImage" v-show="companyForm.organization.bizLicenseImage!=''">
												<img v-bind:src="companyForm.organization.bizLicenseImage">
											</div>
										</el-form-item>
										<el-form-item label="发证机关或登记机关：" class="is-required" prop="organization.licenseOffice" v-show="companyForm.organization.licenseType==2">
											<el-input v-model="companyForm.organization.licenseOffice" :disabled="!licenseOfficeDisabled" @blur="saveLocalData('licenseOffice', companyForm.organization.licenseOffice)"></el-input>
										</el-form-item>
										<el-form-item label="公司详细地址：" class="is-required" prop="organization.companyAddress">
											<el-input v-model="companyForm.organization.companyAddress" @blur="saveLocalData('companyAddress', companyForm.organization.companyAddress)" :disabled="!companyAddressDisabled"></el-input>
										</el-form-item>
										<el-form-item label="公司电话：" class="is-required" prop="organization.companyPhone">
											<el-input v-model="companyForm.organization.companyPhone" @blur="saveLocalData('companyPhone', companyForm.organization.companyPhone)" :disabled="!companyPhoneDisabled"></el-input>
										</el-form-item>
										<el-form-item label="公司紧急联系人：" class="is-required" prop="organization.emerContact">
											<el-input v-model="companyForm.organization.emerContact" @blur="saveLocalData('emerContact', companyForm.organization.emerContact)" :disabled="!emerContactDisabled"></el-input>
										</el-form-item>
										<el-form-item label="公司紧急联系人电话：" class="is-required" prop="organization.emerContactPhone">
											<el-input v-model="companyForm.organization.emerContactPhone" @blur="saveLocalData('emerContactPhone', companyForm.organization.emerContactPhone)" :disabled="!emerContactPhoneDisabled"></el-input>
										</el-form-item>
										<el-form-item label="公司邮箱：" class="is-required" prop="organization.companyEmail">
											<el-input v-model="companyForm.organization.companyEmail" @blur="saveLocalData('companyEmail', companyForm.organization.companyEmail)" :disabled="!companyEmailDisabled"></el-input>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</div>
						<div class="formItem" v-if="companyForm.organization.licenseType==1">
							<el-form :model="companyForm" :rules="rules" ref="companyForm02" label-width="200px">
								<div class="if-item has-border">
									<span>组织机构代码证</span>
								</div>
								<div class="item-unfold">
									<div class="unfold-content">
										<el-form-item label="组织机构代码：" class="is-required" prop="organization.orgCode">
											<el-input v-model="companyForm.organization.orgCode" @blur="saveLocalData('orgCode', companyForm.organization.orgCode)" :disabled="!orgCodeDisabled"></el-input>
										</el-form-item>
										<el-form-item label="组织机构代码副本电子版：" class="is-required" prop="organization.orgCodeImage" :error="imgErrorMsg.orgCodeImage">
											<el-upload :action="uploadUrl" accept="image/jpg,image/jpeg,image/png" :disabled="!orgCodeImageDisabled"
												:multiple="false" :on-success="handleOrgCodeImageSuccess" :show-file-list="false" :before-upload="beforeOrgCodeImageUpload">
												<div class="btn btn-primary" :class="{'disabled':!orgCodeImageDisabled}">上传组织机构代码证</div>
												<div slot="tip" class="el-upload__tip">
													<p class="text-gray">请提供加盖企业红色公章的电子版或原件彩色扫描件或拍照件。</p>
													<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
												</div>
											</el-upload>
											<div class="showOrgCodeImage" v-show="companyForm.organization.orgCodeImage!=''">
												<img v-bind:src="companyForm.organization.orgCodeImage">
											</div>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</div>
						<div class="formItem" v-if="companyForm.organization.licenseType==1">
							<el-form :model="companyForm" :rules="rules" ref="companyForm03" label-width="200px">
								<div class="if-item has-border">
									<span>税务登记证</span>
								</div>
								<div class="item-unfold">
									<div class="unfold-content">
										<el-form-item label="税号：" class="is-required" prop="organization.taxNumber">
											<el-input v-model="companyForm.organization.taxNumber" @blur="saveLocalData('taxNumber', companyForm.organization.taxNumber)" :disabled="!taxNumberDisabled"></el-input>
										</el-form-item>
										<el-form-item label="纳税人类型：" class="is-required" prop="organization.taxpayerType">
											<el-select v-model="companyForm.organization.taxpayerType" @change="saveLocalData('taxpayerType', companyForm.organization.taxpayerType)" placeholder="请选择纳税人类型" :disabled="!taxpayerTypeDisabled">
												<el-option label="非一般纳税人" :value="0"></el-option>
												<el-option label="一般纳税人" :value="1"></el-option>
												<el-option label="小规模纳税人" :value="2"></el-option>
												<el-option label="非增值税纳税人" :value="3"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="纳税类型税码：" class="is-required" prop="organization.taxCode">
											<el-select v-model="companyForm.organization.taxCode" @change="saveLocalData('taxCode', companyForm.organization.taxCode)" placeholder="请选择纳税类型税码"  :disabled="!taxCodeDisabled">
												<el-option label="0%" :value="0"></el-option>
												<el-option label="3%" :value="1"></el-option>
												<el-option label="6%" :value="2"></el-option>
												<el-option label="7%" :value="3"></el-option>
												<el-option label="11%" :value="4"></el-option>
												<el-option label="13%" :value="5"></el-option>
												<el-option label="17%" :value="6"></el-option>
												<el-option label="图书13%免税" :value="7"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="税务登记证电子版：" class="is-required" prop="organization.taxRegCertImage" :error="imgErrorMsg.taxRegCertImage">
											<el-upload :action="uploadUrl" accept="image/jpg,image/jpeg,image/png"  :disabled="!taxRegCertImageDisabled"
												:multiple="false" :on-success="handleTaxRegCertImageSuccess" :show-file-list="false" :before-upload="beforeTaxRegCertImageUpload">
												<div class="btn btn-primary" :class="{'disabled':!taxRegCertImageDisabled}">上传税务登记证</div>
												<div slot="tip" class="el-upload__tip">
													<p class="text-gray">请提供加盖企业红色公章的电子版或原件彩色扫描件或拍照件。</p>
													<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
												</div>
											</el-upload>
											<div class="showTaxRegCertImage" v-show="companyForm.organization.taxRegCertImage!=''">
												<img v-bind:src="companyForm.organization.taxRegCertImage">
											</div>
										</el-form-item>
										<el-form-item label="一般纳税人资格电子版：" class="is-required" prop="organization.taxpayerQualificationImage" :error="imgErrorMsg.taxpayerQualificationImage">
											<el-upload :action="uploadUrl" accept="image/jpg,image/jpeg,image/png" :disabled="!taxpayerQualificationImageDisabled"
												:multiple="false" :on-success="handleTaxpayerQualificationImageSuccess" :show-file-list="false" :before-upload="beforeTaxpayerQualificationImageUpload">
												<div class="btn btn-primary" :class="{'disabled':!taxpayerQualificationImageDisabled}">上传纳税人资格证</div>
												<div slot="tip" class="el-upload__tip">
													<p class="text-gray">请提供加盖企业红色公章的电子版或原件彩色扫描件或拍照件。</p>
													<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
												</div>
											</el-upload>
											<div class="showTaxRegCertImage" v-show="companyForm.organization.taxpayerQualificationImage!=''">
												<img v-bind:src="companyForm.organization.taxpayerQualificationImage">
											</div>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</div>
						<div class="formItem">
							<el-form :model="companyForm" :rules="rules" ref="companyForm04" label-width="200px">
								<div class="if-item has-border">
									<span>开户银行许可证</span>
								</div>
								<div class="item-unfold">
									<div class="unfold-content">
										<el-form-item label="银行开户名：" class="is-required" prop="organization.bankAccountName">
											<el-input v-model="companyForm.organization.bankAccountName" @blur="saveLocalData('bankAccountName', companyForm.organization.bankAccountName)" :disabled="!bankAccountNameDisabled"></el-input>
										</el-form-item>
										<el-form-item label="公司银行账号：" class="is-required" prop="organization.bankAccount">
											<el-input v-model="companyForm.organization.bankAccount" @blur="saveLocalData('bankAccount', companyForm.organization.bankAccount)" :disabled="!bankAccountDisabled"></el-input>
										</el-form-item>
										<el-form-item label="开户银行支行名称：" class="is-required" prop="organization.bankBranchName">
											<el-input v-model="companyForm.organization.bankBranchName" @blur="saveLocalData('bankBranchName', companyForm.organization.bankBranchName)" :disabled="!bankBranchNameDisabled"></el-input>
										</el-form-item>
										<el-form-item label="开户银行支行联行号：" class="is-required" prop="organization.bankBranchLineNumber">
											<el-input v-model="companyForm.organization.bankBranchLineNumber" @blur="saveLocalData('bankBranchLineNumber', companyForm.organization.bankBranchLineNumber)" :disabled="!bankBranchLineNumberDisabled"></el-input>
										</el-form-item>
										<el-form-item label="开户银行支行地址：" class="is-required" prop="organization.bankBranchAddress">
											<el-input v-model="companyForm.organization.bankBranchAddress" @blur="saveLocalData('bankBranchAddress', companyForm.organization.bankBranchAddress)" :disabled="!bankBranchAddressDisabled"></el-input>
										</el-form-item>
										<el-form-item label="银行开户许可证：" class="is-required" prop="organization.bankAccountPermissionImage" :error="imgErrorMsg.bankAccountPermissionImage">
											<el-upload :action="uploadUrl" accept="image/jpg,image/jpeg,image/png"  :disabled="!bankAccountPermissionImageDisabled"
												:multiple="false" :on-success="handleBankAccountPermissionImageSuccess" :show-file-list="false" :before-upload="beforeBankAccountPermissionImageUpload">
												<div class="btn btn-primary" :class="{'disabled':!bankAccountPermissionImageDisabled}">上传银行开户许可证</div>
												<div slot="tip" class="el-upload__tip">
													<p class="text-gray">请提供加盖企业红色公章的电子版或原件彩色扫描件或拍照件。</p>
													<p class="text-gray">为保证您信息正常审核通过，请上传清晰、完整的图片资料。</p>
												</div>
											</el-upload>
											<div class="showBankAccountImg" v-show="companyForm.organization.bankAccountPermissionImage!=''">
												<img :src="companyForm.organization.bankAccountPermissionImage">
											</div>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</div>
					</div>
				</div>
			</div>
			<div class="form-con" v-if="companyForm.organization.certificateType==2">
				<el-form class="common-item" :model="companyForm" :rules="rules" ref="companyForm05" label-width="200px">
					<el-form-item label="公司名称：" class="is-required" prop="organization.companyName">
						<el-input v-model="companyForm.organization.companyName" @blur="saveLocalData('companyName', companyForm.organization.companyName)" :disabled="!companyNameDisabled"></el-input>
						<div class="formDefaultTip">需与营业执照上的公司名称完全一致</div>
					</el-form-item>
					<el-form-item label="统一社会信用代码/税号：" prop="organization.taxNumber" class="is-required">
						<el-input v-model="companyForm.organization.taxNumber" @blur="saveLocalData('taxNumber', companyForm.organization.taxNumber)"></el-input>
						<div class="formDefaultTip">请输入18位的统一社会信用代码或15、18、20位税号</div>
					</el-form-item>
				</el-form>
			</div>
			<transition name="fade" v-if="isShowChoiceMethod">
				<div class="master" style="z-index: 1300;">
					<div class="dialog-pop">
						<div class="pop-header"><span class="header-text">提示</span><span class="header-close" @click="closeDialog()"><em class="icon icon-close"></em></span></div>
						<div class="pop-body">
							<div class="body-infor">
								<h3>您的企业与国美尚未合作</h3>
								<p>请进行企业认证</p>
							</div>
						</div>
						<div class="pop-footer"><span class="btn btn-primary" @click="sure()">企业认证</span><span class="btn btn-gray" @click="closeDialog()">取消</span></div>
					</div>
				</div>
			</transition>
			<div class="form-footer" v-if="fromDrawer !== 'supplementDrawer'">
				<a href="" class="btn btn-simple" @click.prevent="changeStep('identity')">上一步</a>
				<a href="#" class="btn btn-primary" @click.prevent="changeStep('contact')">下一步</a>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store';
window.store = store;
import actions from 'actions';
window.actions = actions;
import Event from 'event';
import {copyObj, formatDate} from 'utils/common';
import apiConfig from '../../../config/api.config.js';
import http from "../../../utils/http";
import socialCreditCodeSrc from '../../../assets/img/socialCreditCode.png';
import AREA_DATA from '../../../help/CITY.js';
export default{
	name:'register-company',
	data() {
		return {
			selectedMsg: '',
			brands: [],
			selectBrands: [],
			brandText: '',
			categorys: [],
			selectCategorys: [],
			currentCategoryId: '',
			defaultOne: [],
			defaultTwo: [],
			defaultThree: [],
			categoryOne: [],
			categoryTwo: [],
			categoryThree: [],
			licenseCity: [],
			regionData: AREA_DATA,
			socialCreditCodeSrc: socialCreditCodeSrc,
			isShowChoiceMethod: false,
			companyNameDisabled: true, //公司名称
			companyTypeDisabled: true, //公司类型
			socialCreditCodeDisabled: true, //社会信用代码
			bizLicenseNumberDisabled: true, //注册号（营业执照号）
			legalReprNameDisabled: true,  //法人代表姓名
			legalReprIdNumberDisabled: true, //身份证号
			legalReprIdImageDisabled: true, //身份证正面
			legalReprIdBackImageDisabled: true,//身份证反面
			bizLicenseProvinceDisabled: true, //营业执照详细地址
			bizLicenseCityDisabled: true, //营业执照详细地址
			bizLicenseAddressDisabled: true, //营业执照详细地址
			bizLicensePostcodeDisabled: true, //邮编
			companyFoundDateDisabled: true, //公司成立时间
			bizStartDateDisabled: true, //营业期限-开始时间
			bizEndDateDisabled: true,   //营业期限-结束时间
			regCapitalDisabled: true,  //注册资本
			bizScopeDisabled: true, //经营范围
			bizLicenseImageDisabled: true, //营业执照副本电子版
			licenseOfficeDisabled: true, //发证机关
			companyAddressDisabled: true, //公司详细地址
			companyPhoneDisabled: true,  //公司电话
			emerContactDisabled: true,  //公司紧急联系人
			emerContactPhoneDisabled: true,  //公司紧急联系人电话
			companyEmailDisabled: true,
			orgCodeDisabled: true, //组织机构代码
			orgCodeImageDisabled: true,
			taxNumberDisabled: true, //税号
			taxpayerTypeDisabled: true,  //纳税人类型
			taxCodeDisabled: true, //纳税类型税码
			taxRegCertImageDisabled: true, //税务登记证电子版
			taxpayerQualificationImageDisabled: true, //一般纳税人资格电子版
			bankAccountNameDisabled: true, //银行开户名
			bankAccountDisabled: true, //公司银行账号
			bankBranchNameDisabled: true, //开户银行支行名称
			bankBranchLineNumberDisabled: true, //开户银行支行联行号
			bankBranchAddressDisabled: true, //开户银行支行地址
			bankAccountPermissionImageDisabled: true, //银行开户
			iscompanyForm01Error: false,
			iscompanyForm02Error: false,
			iscompanyForm03Error: false,
			iscompanyForm04Error: false,
			loading:{
				legalPersonFileFrontLoading:false,
				legalPersonFileReverseLoading:false
			},
			companyForm: {
				companyNature: '',
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				gomeBrandIds: [],
				categorys: [],
				organization:{
					licenseOffice: "",
					bizLicensePostcode: "",
					bizLicenseProvince: "",
					bizLicenseCity: "",
					socialCreditCode: "",
					companyType: "",
					licenseType: 2,
					certificateType: 1,
					companyName: "", //公司名称
					bizLicenseNumber: "", //注册号（营业执照号）
					legalReprName: "",  //法人代表姓名
					legalReprIdNumber: "", //身份证号
					legalReprIdImage: "", //身份证正面
					legalReprIdBackImage: "",//身份证反面
					bizLicenseAddress: "", //营业执照详细地址
					companyFoundDate: "", //公司成立时间
					bizStartDate: "", //营业期限-开始时间
					bizEndDate: "",   //营业期限-结束时间
					regCapital: "",  //注册资本
					bizScope: "", //经营范围
					bizLicenseImage: "", //营业执照副本电子版
					companyAddress: "", //公司详细地址
					companyPhone: "",  //公司电话
					emerContact: "",  //公司紧急联系人
					emerContactPhone: "",  //公司紧急联系人电话
					companyEmail: "",
					orgCode: "", //组织机构代码
					orgCodeImage: "",
					taxNumber: "", //税号
					taxpayerType: "",  //纳税人类型
					taxCode: "", //纳税类型税码
					taxRegCertImage: "", //税务登记证电子版
					taxpayerQualificationImage: "", //一般纳税人资格电子版
					bankAccountName: "", //银行开户名
					bankAccount: "", //公司银行账号
					bankBranchName: "", //开户银行支行名称
					bankBranchLineNumber: "", //开户银行支行联行号
					bankBranchAddress: "", //开户银行支行地址
					bankAccountPermissionImage: "", //银行开户
				}
			},
			companyFoundDate:'',
			bizStartDate:'',
			bizEndDate:'',
			rules: {
				'organization.companyName': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入公司名称')) : callback();},
					trigger: 'blur'
				}],
				'organization.companyType': [{
					validator: (rule, value, callback) => {
						if (this.companyForm.organization.licenseType == 2) {
							!value ? callback(new Error('请输入公司类型')) : callback();
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				'organization.bizLicenseNumber': [{
					validator: (rule, value, callback) => {
						if (this.companyForm.organization.licenseType == 1) {
							!value ? callback(new Error('请输入注册号（营业执照号）')) : callback();
						} else {
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.legalReprName': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入法人代表姓名')) : callback();},
					trigger: 'blur'
				}],
				'organization.legalReprIdNumber': [{
					required: true,
					message: '请输入身份证号',
					trigger: 'blur'
				}, {
					validator: (rule, value, callback) => {
						if(!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/g.test(value)) {
							callback(new Error('请输入正确的身份证号'));
						} else {
							callback();
						}
					}
				}],
				'organization.socialCreditCode': [{
					validator: (rule, value, callback) => {
						if (this.companyForm.organization.licenseType == 2) {
							if ((value + '').trim() == '') {
								callback(new Error('请输入统一社会信用代码'));
							} else if(!/^\w{18}$/.test(value)) {
								callback(new Error('请输入正确的统一社会信用代码'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					}
				}],
				'organization.bizLicensePostcode': [{
					validator: (rule, value, callback) => {
						if ((value + '').trim() == '') {
							callback(new Error('请输入邮政编码'));
						} else if(!/^[0-9]{6}$/.test(value)) {
							callback(new Error('请输入正确的邮政编码'));
						} else {
							callback();
						}
					}
				}],
				'organization.legalReprIdImage': [{
					validator: (rule, value, callback) => {
						if (!value) {
							this.imgErrorMsg['legalReprIdImage'] = '请上传身份证电子版正面';
							callback(new Error('请上传身份证电子版正面'));
						} else {
							this.imgErrorMsg['legalReprIdImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.legalReprIdBackImage': [{
					validator: (rule, value, callback) => {
						if (!value) {
							this.imgErrorMsg['legalReprIdBackImage'] = '请上传身份证电子版反面';
							callback(new Error('请上传身份证电子版反面'));
						} else {
							this.imgErrorMsg['legalReprIdBackImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.bizLicenseAddress': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入照详细地址')) : callback();},
					trigger: 'blur',
				}],
				'organization.bizLicenseProvince': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请选择省份')) : callback();},
					trigger: 'change',
				}],
				'organization.bizLicenseCity': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请选择城市')) : callback();},
					trigger: 'change',
				}],
				companyFoundDate: [{
					validator: (rule, value, callback) => {
						let val = this.companyFoundDate;
						if (val === '' || val.length === 0) {
							callback(new Error('请输入成立日期'));
						} else {
							callback();
						};
					},
					trigger: 'change'
				}],
				bizDate:[{
					validator: (rule, value, callback) => {
						let startVal = this.bizStartDate;
						let endVal = this.bizEndDate;
						if(startVal === '' || startVal.length === 0){
							callback(new Error('请输入营业期限开始时间'));
						}else if(endVal === '' || endVal.length === 0){
							callback(new Error('请输入营业期限结束时间'));
						}else if(+this.companyForm.organization.bizEndDate != 0 && +this.companyForm.organization.bizStartDate >= +this.companyForm.organization.bizEndDate) {
							callback(new Error("开始时间不得晚于结束时间"));
						}else{
							callback();
						};
					},
					trigger: 'change'
				}],
				'organization.regCapital': [{
					validator: (rule, value, callback) => {
						//^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$
						//^\d+(\.\d{6}})?$
						if (!value) {
							callback(new Error('请输入注册资本'));
						} else if(!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,6})?$/g.test(value + '')) {
							callback(new Error('请输入大于0的数字，且小数点后至多填写6位'));
						} else {
							callback();
						}
					}
				}],
				'organization.bizScope': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入经营范围')) : callback();},
					trigger: 'blur'
				}],
				'organization.bizLicenseImage': [{
					validator: (rule, value, callback) => {
						if (!value) {
							this.imgErrorMsg['bizLicenseImage'] = '请上传营业执照副本电子版';
							callback(new Error('请上传营业执照副本电子版'));
						} else {
							this.imgErrorMsg['bizLicenseImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.companyAddress': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入公司详细地址')) : callback();},
					trigger: 'blur'
				}],
				'organization.licenseOffice': [{
					validator: (rule, value, callback) => {
						if (this.companyForm.organization.licenseType == 2) {
							!value ? callback(new Error('请输入发证机关或登记机关')) : callback();
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				'organization.companyPhone': [{
					required: true,
					message: '请输入公司电话',
					trigger: 'blur'
				}, {
					validator: (rule, value, callback) => {
						let parttenMobile = /^(\d{3,4}\-?)?\d{7,8}$/;
						let parttenPhone = /^1[34578]\d{9}$/g;
						if(!(parttenMobile.test(value) || parttenPhone.test(value))) {
							callback(new Error('请输入正确的电话'));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}],
				'organization.emerContact': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入公司紧急联系人')) : callback();},
					trigger: 'blur'
				}],
				'organization.emerContactPhone': [{
					required: true,
					message: '请输入公司紧急联系人手机',
					trigger: 'blur'
				}, {
					validator: (rule, value, callback) => {
						if(!/^1[34578]\d{9}$/g.test(value)) {
							callback(new Error('请输入合法的手机号'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				'organization.companyEmail': [{ validator: function(rule, value, callback) {
				    if(!value){
						callback(new Error('请输入公司邮箱'));
					}else if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) {
						callback(new Error('请输入有效邮箱地址'));
					}else{
						callback();
					}
				    }, trigger: 'blur'
				}],
				'organization.orgCode': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入组织机构代码')) : callback();},
					trigger: 'blur'
				}],
				'organization.orgCodeImage': [{
					validator: (rule, value, callback) => {
						if (!value) {
							this.imgErrorMsg['orgCodeImage'] = '请上传组织机构代码副本电子版';
							callback(new Error('请上传组织机构代码副本电子版'));
						} else {
							this.imgErrorMsg['orgCodeImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.taxNumber': [{
					validator: (rule, value, callback) => {
						let msg = this.companyForm.organization.certificateType == 1 ? '税号' : '统一社会信用代码或税号';
						if ((value + '').trim() == '') {
							callback(new Error('请输入' + msg));
						}else if(!/^(\w{15}|\w{18}|\w{20})$/.test(value)) {
							callback(new Error('请输入正确的' + msg));
						} else {
							callback();
						}
					}
				}],
				'organization.taxpayerType': [{
					validator: function (rule, value, callback) {
						if(!value && value !== 0){
							callback(new Error('请选择纳税人类型'));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}],
				'organization.taxCode': [{
					validator: function (rule, value, callback) {
						if(!value && value !== 0){
							callback(new Error('请选择纳税类型税码'));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}],
				'organization.taxRegCertImage': [{
					validator: (rule, value, callback) => {
						if (!value) {
							this.imgErrorMsg['taxRegCertImage'] = '请上传税务登记证电子版';
							callback(new Error('请上传税务登记证电子版'));
						} else {
							this.imgErrorMsg['taxRegCertImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.taxpayerQualificationImage': [{
					validator: (rule, value, callback) =>{
						if (!value) {
							this.imgErrorMsg['taxpayerQualificationImage'] = '请上传一般纳税人资格电子版';
							callback(new Error('请上传一般纳税人资格电子版'));
						} else {
							this.imgErrorMsg['taxpayerQualificationImage'] = '';
							callback()
						}
					},
					trigger: 'blur'
				}],
				'organization.bankAccountName': [{
					validator: function (rule, value, callback) {
						!value ? callback(new Error('请输入银行开户名')) : callback();
					},
					trigger: 'blur'
				}],
				'organization.bankAccount': [{
					validator: function (rule, value, callback) {
						!value ? callback(new Error('请输入公司银行账号')) : callback();
					},
					trigger: 'blur'
				}],
				'organization.bankBranchName': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入开户银行支行名称')) : callback();},
					trigger: 'blur'
				}],
				'organization.bankBranchLineNumber': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入开户银行支行联行号')) : callback();},
					trigger: 'blur'
				}],
				'organization.bankBranchAddress': [{
					validator: function (rule, value, callback) {!value ? callback(new Error('请输入开户银行支行地址')) : callback();},
					trigger: 'blur'
				}],
				'organization.bankAccountPermissionImage': [{validator: (rule, value, callback) => {
					if (!value) {
						this.imgErrorMsg['bankAccountPermissionImage'] = '请上传银行开户许可证电子版';
						callback(new Error('请上传银行开户许可证电子版'));
					} else {
						this.imgErrorMsg['bankAccountPermissionImage'] = '';
						callback()
					}
				}, trigger: 'blur'}],
				'gomeBrandIds': [{
					validator: (rule, value, callback) => {
						if (this.userInfo.type == 1 || this.userInfo.type == 2) {
							if (this.selectBrands.length == 0) {
								callback(new Error('请选择经营品牌'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				'categorys': [{
					validator: (rule, value, callback) => {
						if (this.userInfo.type == 2) {
							if (this.selectCategorys.length == 0) {
								callback(new Error('请选择经营品类'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			},
			uploadUrl: `${$CONFIG['domain']}/api/image/upload`,
			fixedNav: false,
			offsetTop: [],
			scrollTop: 0,
			navList: [{
				msg: '营业执照',
				iconColor: 'defaultColor',
				icon: 'icon-right'
			}, {
				msg: '开户银行许可证',
				iconColor: 'defaultColor',
				icon: 'icon-right'
			}],
			heightLightIndex: 0,
			drawerPart: null,
			imgErrorMsg: {
				legalReprIdImage: "",
				legalReprIdBackImage: "",
				bizLicenseImage: "",
				orgCodeImage: "",
				taxRegCertImage: "",
				taxpayerQualificationImage: "",
				bankAccountPermissionImage: "",
			},
			fromDrawer: ''
		};
	},
	computed: {
		companyNature() {
			return store.state.anicerFormData.companyNature ? store.state.anicerFormData.companyNature : store.state.anicerFormData.type
		},
		hasCompanyInfo:() => store.state.anicerControl.hasCompanyInfo,
		anicerData:() => store.state.anicerFormData,
		shopAnicerData:() => store.state.shopAnicerFormData,
		userInfo: () => store.state.userInfo,
		taxpayerTypeText(){
			let type = '';
			switch (store.state.anicerFormData.taxpayerType){
				case '0':
					type = '非一般纳税人';
					break;
				case '1':
					type = '一般纳税人';
					break;
				case '2':
					type = '小规模纳税人';
					break;
				case '3':
					type = '非增值税纳税人';
					break;
			}
			return type;
		},
		taxCodeText(){
			let code = '';
			switch (store.state.anicerFormData.taxCode){
				case '0':
					code = '0%';
					break;
				case '1':
					code = '3%';
					break;
				case '2':
					code = '6%';
					break;
				case '3':
					code = '7%';
					break;
				case '4':
					code = '11%';
					break;
				case '5':
					code = '13%';
					break;
				case '7':
					code = '图书13%免税';
					break;
				case '6':
					code = '17%';
					break;
			}
			return code;
		},
		person(){
			if(this.companyNature == '1'){
				return '入驻商家'
			} else if(companyNature == '2'){
				return '品牌商'
			} else if(companyNature == '3'){
				return '代理商'
			} else if(companyNature == '5'){
				return '第三方广告主'
			}
		},
		gomeplusAccount:() => store.state.userInfo.loginName
	},
	activated() {
		this.fixedNav = false;
		document.documentElement.scrollTop = document.body.scrollTop = 0;
		window.addEventListener('scroll', this.scrollEvent);
	},
	deactivated() {
		window.removeEventListener('scroll', this.scrollEvent);
	},
	created() {
		this.getLocalData();
		if(!this.isEmptyObj(this.anicerData)){
			this.companyForm = copyObj(this.anicerData);
		}
		this.companyFoundDate = this.companyForm.organization.companyFoundDate ? formatDate(this.companyForm.organization.companyFoundDate, 'yyyy-MM-dd') : '';
		this.bizStartDate = this.companyForm.organization.bizStartDate ? formatDate(this.companyForm.organization.bizStartDate, 'yyyy-MM-dd') : '';
		this.bizEndDate = this.companyForm.organization.bizEndDate ? formatDate(this.companyForm.organization.bizEndDate, 'yyyy-MM-dd') : '';
		let regionIndex = this.regionData.findIndex((res) => {return res.name == this.companyForm.organization.bizLicenseProvince;});
		if (regionIndex != -1) {
			this.licenseCity = [...this.regionData[regionIndex].city];
		}
		this.codeDisabled(this.shopAnicerData);
		if (this.$route.name == 'supcert') {
			this.fromDrawer = 'supplementDrawer';
		}
		if (this.campanyNature == 2) {
			this.getCategorys();
		}
	},
	destroyed() {
		if (this.fromDrawer == 'supplementDrawer') {
			window.removeEventListener('scroll', this.scrollEvent);
		}
	},
	mounted() {
		this.getOffsetTop();
		Event.$off('nextStep');
		Event.$on('nextStep',() => {
			this.changeStep('contact');
		});
		if (this.fromDrawer == 'supplementDrawer') {
			// this.drawerPart = document.getElementsByClassName('drawer-part')[0];
			window.addEventListener('scroll', this.scrollEvent);
			document.documentElement.scrollTop = document.body.scrollTop = 0;
		}
		this.$nextTick(() => {
			this.getError();
		});
	},
	methods: {
		search() {
			if (this.brandText.trim().length == 0) {
				return false;
			}
			http.get('/api/brands', {
				hideLoading: true,
				params: {
					keyword: this.brandText.trim(),
				}
			}).then((res) => {
				if (res.data.code === 200) {
					this.brands = res.data.data;
					if (this.brands.length == 0) {
						this.selectedMsg = '<span style="color:#ca483f;">无搜索结果</span>';
					} else {
						this.selectedMsg = '';
						this.brands.forEach((item) => {
							this.$set(item, 'checked', this.selectGomeBrandIds.toString().indexOf(item.gomeBrandId) > -1);
						});
					}
				}
			}).catch((error) => {
				// console.log(error);
			});
		},
		selectBrand(brand) {
			let index = this.selectBrands.findIndex((res) =>{
				return res.gomeBrandId == brand.gomeBrandId;
			});
			if (brand.checked) {
				this.selectBrands.push(brand);
			} else {
				this.selectBrands.splice(index, 1);
			}
		},
		removeBrand(index) {
			let gomeBrandId = this.selectBrands[index].gomeBrandId;
			for (let brand of this.brands) {
				if (brand.gomeBrandId === gomeBrandId) {
					brand.checked = false;
					break;
				}
			}
			this.selectBrands.splice(index, 1);
		},
		getCategorys() {
			http.get('/api/categorys').then(res => {
				if (res.data.code == 200 && res.data.iserror === 0) {
					this.categorys = res.data.data;
					this.defaultOne = [];
					this.defaultTwo = [];
					this.defaultThree = [];
					// let selectIds = this.getCategoryIds();
					let selectIds = [];
					for (let c of this.categorys) {
						this.$set(c, 'checked', selectIds.indexOf(c.categoryId) > -1);
						if (c.level == 1) {
							this.defaultOne.push(c);
						} else if (c.level == 2) {
							this.defaultTwo.push(c);
						} else {
							this.defaultThree.push(c);
						}
					}
					this.categoryOne = this.defaultOne;
					// this.getCategoryOne();
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		clickCategory(category) {
			let categorys = [];
			if (category.level === 1 && this.currentCategoryId !== category.categoryId) {
				this.categoryTwo = [];
				this.categoryThree = [];
				this.currentCategoryId = category.categoryId;
			}
			if (category.level === 1) {
				for (let c of this.defaultTwo) {
					if (c.parentId === category.categoryId && c.level === 2) {
						categorys.push(c);
					}
				}
				this.categoryTwo = categorys;
			} else if (category.level === 2) {
				for (let c of this.defaultThree) {
					if (c.parentId === category.categoryId && c.level === 3) {
						categorys.push(c);
					}
				}
				this.categoryThree = categorys;
			}
		},
		selectCategory(category) {
			if (category.checked) {
				this.selectCategorys.push(category);
			} else {
				let index = this.selectCategorys.findIndex((res) =>{
					return res.categoryId == category.categoryId;
				});
				this.selectCategorys.splice(index, 1);
			}
		},
		removeCategory(index) {
			let categoryId = this.selectCategorys[index].categoryId;
			for (let category of this.categoryThree) {
				if (category.categoryId === categoryId) {
					category.checked = false;
					break;
				}
			}
			this.selectCategorys.splice(index, 1);
		},
		getError() {
			if (this.companyNature == '1' || this.fromDrawer == 'supplementDrawer') {
				if (this.companyForm.organization.licenseType == 1) {
					this.validateForm01();
					this.validateForm02();
					this.validateForm03();
					this.validateForm04();
				} else {
					this.validateForm01();
					this.validateForm04();
				}
			}
		},
		drawerPartScroll(e) {
			let formMain = document.getElementsByClassName('formMain')[0];
			this.scrollTop = e.target.scrollTop;
			if ((this.scrollTop - formMain.offsetTop) >= 0) {
				this.fixedNav = true;
			} else {
				this.fixedNav = false;
			}
		},
		getLocalData() {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let data = JSON.parse(localStorage.getItem(this.userInfo.userId));
				this.companyForm.companyNature = data.companyNature;
				this.companyForm.organization.licenseType = data.licenseType;
				this.companyForm.organization.certificateType = data.certificateType;
				this.companyForm.organization.companyName = data.companyName;
				this.companyForm.organization.companyType = data.companyType;
				this.companyForm.organization.bizLicenseNumber = data.bizLicenseNumber;
				this.companyForm.organization.socialCreditCode = data.socialCreditCode;
				this.companyForm.organization.legalReprName = data.legalReprName;
				this.companyForm.organization.legalReprIdNumber = data.legalReprIdNumber;
				this.companyForm.organization.legalReprIdImage = data.legalReprIdImage;
				this.companyForm.organization.legalReprIdBackImage = data.legalReprIdBackImage;
				this.companyForm.organization.bizLicenseProvince = data.bizLicenseProvince;
				this.companyForm.organization.bizLicenseCity = data.bizLicenseCity;
				this.companyForm.organization.bizLicenseAddress = data.bizLicenseAddress;
				this.companyForm.organization.bizLicensePostcode = data.bizLicensePostcode;
				this.companyFoundDate = formatDate(data.companyFoundDate, 'yyyy-MM-dd');
				this.bizStartDate = formatDate(data.bizStartDate, 'yyyy-MM-dd');
				this.bizEndDate = formatDate(data.bizEndDate, 'yyyy-MM-dd');
				this.companyForm.organization.regCapital = data.regCapital;
				this.companyForm.organization.bizScope = data.bizScope;
				this.companyForm.organization.bizLicenseImage = data.bizLicenseImage;
				this.companyForm.organization.companyAddress = data.companyAddress;
				this.companyForm.organization.companyPhone = data.companyPhone;
				this.companyForm.organization.emerContact = data.emerContact;
				this.companyForm.organization.emerContactPhone = data.emerContactPhone;
				this.companyForm.organization.companyEmail = data.companyEmail;
				this.companyForm.organization.licenseOffice = data.licenseOffice;
				this.companyForm.organization.orgCode = data.orgCode;
				this.companyForm.organization.orgCodeImage = data.orgCodeImage;
				this.companyForm.organization.taxNumber = data.taxNumber;
				this.companyForm.organization.taxpayerType = data.taxpayerType;
				this.companyForm.organization.taxCode = data.taxCode;
				this.companyForm.organization.taxRegCertImage = data.taxRegCertImage;
				this.companyForm.organization.taxpayerQualificationImage = data.taxpayerQualificationImage;
				this.companyForm.organization.bankAccountName = data.bankAccountName;
				this.companyForm.organization.bankAccount = data.bankAccount;
				this.companyForm.organization.bankBranchName = data.bankBranchName;
				this.companyForm.organization.bankBranchLineNumber = data.bankBranchLineNumber;
				this.companyForm.organization.bankBranchAddress = data.bankBranchAddress;
				this.companyForm.organization.bankAccountPermissionImage = data.bankAccountPermissionImage;
			}
			let brands = localStorage.getItem(this.userInfo.userId + '_brands');
			if (brands) {
				this.selectBrands = JSON.parse(brands);
			}
			let categorys = localStorage.getItem(this.userInfo.userId + '_categorys');
			if (categorys) {
				this.selectCategorys = JSON.parse(categorys);
			}
		},
		saveLocalData(key, data) {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				localData[key] = data;
				localStorage.setItem(this.userInfo.userId, JSON.stringify(localData));
			}
		},
		applyInnerCityLicense(index) {
			this.companyForm.organization.bizLicenseCity = "";
			this.bizLicenseCityDisabled = true;
			this.licenseCity = [...this.regionData[index].city];
		},
		changeForm(index) {
			/*
			if (this.fromDrawer == 'supplementDrawer') {
				this.drawerPart.scrollTop = this.offsetTop[index];
			} else {*/
				document.documentElement.scrollTop = document.body.scrollTop = this.offsetTop[index];
			// }
		},
		getSelected(top, index) {
			let flag = false;
			let winH = (document.documentElement.clientHeight || document.body.clientHeight) * 0.2;
			if (index == 0) {
				flag = (top >= 0 && top < (this.offsetTop[index + 1] - winH));
			} else if (index == (this.navList.length - 1)) {
				flag = (top >= (this.offsetTop[index] - winH));
			} else {
				flag = (top >= (this.offsetTop[index] - winH) && top < (this.offsetTop[index + 1] - winH));
			}
			if (flag) {
				this.heightLightIndex = index;
			}
			return flag;
		},
		getOffsetTop() {
			let arr = [];
			let form = document.getElementsByClassName('formItem');
			for (let i = 0; i < form.length; i++) {
				arr.push(form[i].offsetTop);
			}
			this.offsetTop = arr;
		},
		scrollEvent() {
			if (this.companyForm.organization.certificateType == 2) {
				return;
			}
			this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			let formMain = document.getElementsByClassName('formMain')[0];
			let winH = document.documentElement.clientHeight || document.body.clientHeight;
			if ((this.scrollTop - formMain.offsetTop) >= 0) {
				this.fixedNav = true;
			} else {
				this.fixedNav = false;
			}
		},
		changeChoiceMethod(type) {
			this.companyForm.organization.certificateType = type;
			this.saveLocalData('certificateType', type);
			if (type == 1) {
				this.$nextTick(() => {
					this.getOffsetTop();
				});
			}
		},
		isEmptyObj(obj)  {
			for (let name in obj) {
				if (obj.hasOwnProperty(name) && name !== 'companyNature') {
					return false;
				}
			}
			return true;
		},
		codeDisabled(shopAnicerData){
			if(this.companyNature == '1') {
				let data = copyObj(shopAnicerData);
				let parttenMobile = /^(\d{3,4}\-?)?\d{7,8}$/;
				let parttenPhone = /^1[34578]\d{9}$/g;
				this.companyNameDisabled = !data.organization.companyName; //公司名称
				this.companyTypeDisabled = !data.organization.companyType; //公司类型
				this.bizLicenseNumberDisabled = !data.organization.bizLicenseNumber; //注册号（营业执照号）
				this.socialCreditCodeDisabled = !data.organization.socialCreditCode || !/^\w{18}$/.test(data.organization.socialCreditCode); //注册号（营业执照号）
				this.legalReprNameDisabled = !data.organization.legalReprName;  //法人代表姓名
				this.legalReprIdNumberDisabled = !data.organization.legalReprIdNumber || !/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/g.test(data.organization.legalReprIdNumber); //身份证号
				this.legalReprIdImageDisabled = !data.organization.legalReprIdImage ; //身份证正面
				this.legalReprIdBackImageDisabled = !data.organization.legalReprIdBackImage ;//身份证反面
				this.bizLicenseProvinceDisabled =  !data.organization.bizLicenseProvince ; //营业执照详细地址
				this.bizLicenseCityDisabled =  !data.organization.bizLicenseCity ; //营业执照详细地址
				this.bizLicenseAddressDisabled =  !data.organization.bizLicenseAddress ; //营业执照详细地址
				this.bizLicensePostcodeDisabled =  !data.organization.bizLicensePostcode || !/^[1-9][0-9]{5}$/.test(data.organization.bizLicensePostcode); //邮编
				this.companyFoundDateDisabled =  !data.organization.companyFoundDate ; //公司成立时间
				this.bizStartDateDisabled =  !data.organization.bizStartDate ; //营业期限-开始时间
				this.bizEndDateDisabled =  !data.organization.bizEndDate ;  //营业期限-结束时间
				this.regCapitalDisabled =  !data.organization.regCapital ;  //注册资本
				this.bizScopeDisabled =  !data.organization.bizScope ; //经营范围
				this.bizLicenseImageDisabled =  !data.organization.bizLicenseImage ; //营业执照副本电子版
				this.companyAddressDisabled =  !data.organization.companyAddress ; //公司详细地址
				this.licenseOfficeDisabled =  !data.organization.licenseOffice ; //发证机关
				this.companyPhoneDisabled =  !data.organization.companyPhone || !(parttenMobile.test(data.organization.companyPhone) || parttenPhone.test(data.organization.companyPhone));  //公司电话
				this.emerContactDisabled =  !data.organization.emerContact ;  //公司紧急联系人
				this.emerContactPhoneDisabled =  !data.organization.emerContactPhone || !/^1[34578]\d{9}$/g.test(data.organization.emerContactPhone) ;  //公司紧急联系人电话
				this.companyEmailDisabled =  !data.organization.companyEmail || !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(data.organization.companyEmail);
				this.orgCodeDisabled =  !data.organization.orgCode ; //组织机构代码
				this.orgCodeImageDisabled =  !data.organization.orgCodeImage ;
				this.taxNumberDisabled =  !data.organization.taxNumber || !/^(\w{15}|\w{18}|\w{20})$/.test(data.organization.taxNumber); //税号
				this.taxpayerTypeDisabled =  !(data.organization.taxpayerType || data.organization.taxpayerType == 0);  //纳税人类型
				this.taxCodeDisabled =  !(data.organization.taxCode || data.organization.taxCode == 0) ; //纳税类型税码
				this.taxRegCertImageDisabled =  !data.organization.taxRegCertImage ; //税务登记证电子版
				this.taxpayerQualificationImageDisabled =  !data.organization.taxpayerQualificationImage ; //一般纳税人资格电子版
				this.bankAccountNameDisabled =  !data.organization.bankAccountName ; //银行开户名
				this.bankAccountDisabled =  !data.organization.bankAccount ; //公司银行账号
				this.bankBranchNameDisabled =  !data.organization.bankBranchName ; //开户银行支行名称
				this.bankBranchLineNumberDisabled =  !data.organization.bankBranchLineNumber ; //开户银行支行联行号
				this.bankBranchAddressDisabled =  !data.organization.bankBranchAddress ; //开户银行支行地址
				this.bankAccountPermissionImageDisabled =  !data.organization.bankAccountPermissionImage ; //银行开户
			};

		},
		validateForm01() {
			let validate;
			this.$refs['companyForm01'].validate((result) => {
				this.changeIcon(result, 0);
				validate = result;
			});
			return validate;
		},
		validateForm02() {
			let validate;
			this.$refs['companyForm02'].validate((result) => {
				this.changeIcon(result, 1);
				validate = result;
			});
			return validate;
		},
		validateForm03() {
			let validate;
			this.$refs['companyForm03'].validate((result) => {
				this.changeIcon(result, 2);
				validate = result;
			});
			return validate;
		},
		validateForm04() {
			let validate;
			this.$refs['companyForm04'].validate((result) => {
				this.changeIcon(result, 3);
				validate = result;
			});
			return validate;
		},
		changeIcon(result, index) {
			let listIndex = index == 3 && this.companyForm.organization.licenseType == 2 ? 1 : index;
			if (!result) {
				this.navList[listIndex].icon = 'icon-close';
				this.navList[listIndex].iconColor = 'errorColor';
			} else {
				this.navList[listIndex].icon = 'icon-right';
				this.navList[listIndex].iconColor = 'successColor';
			}
		},
		changeStep(type) {
			let vm = this;
			if(type == 'identity'){
				actions.controlAnicer(vm.$store,{step:type});
				this.saveLocalData('step', type);
				return false;
			}
			this.$refs['companyFormTop'].validate(result => {
				if (result) {
					let companyForm = copyObj(vm.companyForm);
					let brands = [], categorys = [];
					for (let brand of this.selectBrands) {
						brands.push(brand.gomeBrandId);
					}
					for (let category of this.selectCategorys) {
						categorys.push({gomeCategoryId: category.gomeCategoryId, level: category.level});
					}
					companyForm.gomeBrandIds = brands;
					companyForm.categorys = categorys;
					localStorage.setItem(this.userInfo.userId + '_brands', JSON.stringify(this.selectBrands));
					localStorage.setItem(this.userInfo.userId + '_categorys', JSON.stringify(this.selectCategorys));
					this.saveLocalData('companyNature', this.companyForm.companyNature);
					if (this.companyForm.organization.certificateType == 1) {
						if (this.companyForm.organization.licenseType == 2) {
							if(this.validateForm04() && this.validateForm01()){
								actions.setAnicerData(vm.$store,companyForm);
								actions.controlAnicer(vm.$store,{step:type});
								this.saveLocalData('step', type);
							} else {
								return false;
							}
						} else {
							if(this.validateForm04() && this.validateForm01() && this.validateForm02() && this.validateForm03()){
								actions.setAnicerData(vm.$store,companyForm);
								actions.controlAnicer(vm.$store,{step:type});
								this.saveLocalData('step', type);
							} else {
								return false;
							}
						}
					} else {
						this.$refs['companyForm05'].validate((result) => {
							if (result) {
								http.get('/api/anicer/fast', {
									params: {
										companyName: this.companyForm.organization.companyName,
										taxNumber: this.companyForm.organization.taxNumber
									}
								})
								.then((res) => {
									if (res.data.code == 200) {
										if (res.data.data.customerNo != '') {
											actions.setAnicerData(vm.$store,companyForm);
											actions.controlAnicer(vm.$store,{step:type});
											this.saveLocalData('step', type);
										} else {
								            this.isShowChoiceMethod= true;
										}
									}
								})
								.catch((error) => {
									console.log(error);
								})
							} else {
								return false;
							}
						});
					}
				}
			});
		},
		judgeImgError(file, errorKey) {
			const isImgType = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
	        const isLt5M = file.size / 1024 / 1024 < 5;
	        if (!isImgType) {
	          	this.imgErrorMsg[errorKey] = '图片格式仅支持jpg，jpeg，png';
	        } else {
	        	if (!isLt5M) {
		          	this.imgErrorMsg[errorKey] = '图片大小最大为5MB';
		        }
	        }
	        return isImgType && isLt5M;
		},
		beforeLegalReprIdImageUpload(file) {
			return this.judgeImgError(file, 'legalReprIdImage');
		},
		beforeLegalReprIdBackImageUpload(file) {
			return this.judgeImgError(file, 'legalReprIdBackImage');
		},
		beforeBizLicenseImageUpload(file) {
			return this.judgeImgError(file, 'bizLicenseImage');
		},
		beforeOrgCodeImageUpload(file) {
			return this.judgeImgError(file, 'orgCodeImage');
		},
		beforeTaxRegCertImageUpload(file) {
			return this.judgeImgError(file, 'taxRegCertImage');
		},
		beforeTaxpayerQualificationImageUpload(file) {
			return this.judgeImgError(file, 'taxpayerQualificationImage');
		},
		beforeBankAccountPermissionImageUpload(file) {
			return this.judgeImgError(file, 'bankAccountPermissionImage');
		},
		handleLegalReprIdImageSuccess(response,file, fileList) {//法人身份证电子版(正面)
			if (response.code === 200) {
				this.companyForm.organization.legalReprIdImage = response.data.imageUrl;
				this.saveLocalData('legalReprIdImage', response.data.imageUrl);
				this.$refs.companyForm01.validateField('organization.legalReprIdImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleLegalReprIdBackImageSuccess(response) {//法人身份证电子版(背面)
			if(response.code === 200){
				this.companyForm.organization.legalReprIdBackImage = response.data.imageUrl;
				this.saveLocalData('legalReprIdBackImage', response.data.imageUrl);
				this.$refs.companyForm01.validateField('organization.legalReprIdBackImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleBizLicenseImageSuccess(response){//营业执照副本电子版
			if(response.code === 200){
				this.companyForm.organization.bizLicenseImage = response.data.imageUrl;
				this.saveLocalData('bizLicenseImage', response.data.imageUrl);
				this.$refs.companyForm01.validateField('organization.bizLicenseImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleOrgCodeImageSuccess(response){//组织机构代码副本电子版
			if(response.code === 200){
				this.companyForm.organization.orgCodeImage = response.data.imageUrl;
				this.saveLocalData('orgCodeImage', response.data.imageUrl);
				this.$refs.companyForm02.validateField('organization.orgCodeImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleTaxRegCertImageSuccess(response){//税务登记证电子版
			if(response.code === 200){
				this.companyForm.organization.taxRegCertImage = response.data.imageUrl;
				this.saveLocalData('taxRegCertImage', response.data.imageUrl);
				this.$refs.companyForm03.validateField('organization.taxRegCertImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleTaxpayerQualificationImageSuccess(response){//一般纳税人资格电子版
			if(response.code === 200){
				this.companyForm.organization.taxpayerQualificationImage = response.data.imageUrl;
				this.saveLocalData('taxpayerQualificationImage', response.data.imageUrl);
				this.$refs.companyForm03.validateField('organization.taxpayerQualificationImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		handleBankAccountPermissionImageSuccess(response){//银行开户许可证电子版
			if(response.code === 200){
				this.companyForm.organization.bankAccountPermissionImage = response.data.imageUrl;
				this.saveLocalData('bankAccountPermissionImage', response.data.imageUrl);
				this.$refs.companyForm04.validateField('organization.bankAccountPermissionImage');
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		sure() {
			this.changeChoiceMethod(1);
			this.closeDialog();
		},
		closeDialog(){
			this.isShowChoiceMethod = false;
		},
	},
	watch: {
		companyFoundDate: function() {
			if (this.companyFoundDate) {
				this.companyForm.organization.companyFoundDate = new Date(this.companyFoundDate).valueOf();
				this.saveLocalData('companyFoundDate', new Date(this.companyFoundDate).valueOf());
			}
		},
		bizStartDate: function() {
			if (this.bizStartDate) {
				this.companyForm.organization.bizStartDate = new Date(this.bizStartDate).valueOf();
				this.saveLocalData('bizStartDate', new Date(this.bizStartDate).valueOf());
			}
		},
		bizEndDate: function() {
			if (this.bizEndDate) {
				this.companyForm.organization.bizEndDate = new Date(this.bizEndDate).valueOf();
				this.saveLocalData('bizEndDate', new Date(this.bizEndDate).valueOf());
			}
		},
		heightLightIndex: function(val, oldVal) {
			if (oldVal == 0) {
				this.validateForm01();
			} else if (oldVal == 1) {
				if (this.companyForm.organization.licenseType == 2) {
					this.validateForm04();
				} else {
					this.validateForm02();
				}
			} else if (oldVal == 2) {
				this.validateForm03();
			} else if (oldVal == 3) {
				this.validateForm04();
			}
		},
		'companyForm.organization.licenseType': function() {
			if (this.companyForm.organization.licenseType == 1) {
				this.navList = [{
					msg: '营业执照',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}, {
					msg: '组织机构代码证',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}, {
					msg: '税务登记证',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}, {
					msg: '开户银行许可证',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}];
			} else {
				this.navList = [{
					msg: '营业执照',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}, {
					msg: '开户银行许可证',
					iconColor: 'defaultColor',
					icon: 'icon-right'
				}];
			}
			this.$nextTick(() => {
				this.getOffsetTop();
			});
		},
		'companyForm.companyNature': function(val, oldVal) {
			if (val == 2) {
				this.getCategorys();
			}
		}
	}
};
</script>
<style lang="less" scoped>
	.check-item {
		padding: 0 15px;
		height: 28px;
		line-height: 28px;
		display: block;
		cursor: pointer;
		color: #404d5f;
		&:hover {
			background: #effcef;
		}
	}
	.con-box {
		height: 200px;
		border: 1px solid #ddd;
		overflow: auto;
	}
	.disabled, .disabled:hover{
		cursor: not-allowed;
		background: #eef1f6;
		border-color:  #eef1f6;
		color: #bfcbd9;
	}
	.form-error{
		color:#ff4949
	}
	.anicer-fade-enter-active, .anicer-fade-leave-active {
		transition: opacity 0.3s;
	}
	.anicer-fade-enter, .anicer-fade-leave-active {
		opacity: 0
	}
	.el-input,.el-textarea,.el-select{width: 420px;}
	.licenceType {
		height: 100px;
		position: relative;
	}
	.licenceType .licenseTip {
		color: #a9a9a9;
		position: absolute;
		left: 73px;
		top: 25px;
	}
	.formDefaultTip {
		height: 14px;
		line-height: 14px;
		color: #a1a1a1;
		margin-top: 5px;
	}
	.formGraphic{
		height: 14px;
		line-height: 14px;
		margin-top: 5px;
	}
	.formGraphic a:hover {
		text-decoration: underline;
	}
	.showBizLicenseImage {
		width:140px;
		margin-top: 20px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
	}
	.showBizLicenseImage img{
		width:138px;
		height: 198px;
		border-radius: 4px;
	}
	.showLegalReprId {
		width: 140px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
	}
	.showLegalReprId img {
		width: 138px;
		height: 78px;
		border-radius: 4px;
	}
	.showBankAccountImg {
		width: 144px;
		height: 100px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 20px;
	}
	.showBankAccountImg img {
		width:100%;
		height: 100%;
	}
	.showOrgCodeImage {
		width: 140px;
		height: 200px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	.showOrgCodeImage img {
		width:100%;
		height: 100%;
	}
	.showTaxRegCertImage {
		width: 140px;
		height: 100px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	.showTaxRegCertImage img {
		width:100%;
		height: 100%;
	}
</style>
